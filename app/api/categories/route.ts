import { NextRequest, NextResponse } from 'next/server';
import { categories, db } from '@/lib/store';
import { Category, PaginatedResponse } from '@/types';

// Получение списка рубрик с пагинацией
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
      // Получаем номер страницы и лимит из запроса
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));

    const total = categories.length;
    const pages = Math.ceil(total / limit) || 1;

    // Берем только нужную часть элементов для текущей страницы
    const offset = (page - 1) * limit;
    const paginatedItems = categories.slice(offset, offset + limit);


    const response: PaginatedResponse<Category> = {
      items: paginatedItems,
      total,
      page,
      pages, };

    return NextResponse.json(response); } catch (error) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 }); }
}

// Создание новой рубрики с полной валидацией
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Валидация на наличие обязательных полей и соответствие типов данных
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({ error: 'Поле "name" обязательно и должно быть строкой' }, { status: 422 }); }
    
    if (body.description !== undefined && typeof body.description !== 'string') {
      return NextResponse.json({ error: 'Поле "description" должно быть строкой' }, { status: 422 }); }

    if (body.isArchived !== undefined && typeof body.isArchived !== 'boolean') {
      return NextResponse.json({ error: 'Поле "isArchived" должно быть логического типа (true/false)' }, { status: 422 }); }

    // 2. Проверка уникальности поля по существующим данным в хранилище
    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase().trim() === body.name.toLowerCase().trim());
    if (isDuplicate) {
      return NextResponse.json({ error: 'Рубрика с таким названием уже существует' }, { status: 422 }); }

    // 3. Формирование объекта (UUID, дефолтные значения типов, ручные даты)
    const timestamp = new Date().toISOString();
    const newCategory: Category = {
      id: crypto.randomUUID(), // Генерация UUID по ТЗ
      name: body.name.trim(),
      description: body.description ? body.description.trim() : '',
      articlesCount: 0, // Стартовое числовое поле
      isArchived: body.isArchived ?? false, // Обязательное булево поле
      createdAt: timestamp,
      updatedAt: timestamp,};

    categories.push(newCategory);
    return NextResponse.json(newCategory, { status: 201 });} catch (error) 
    { return NextResponse.json({ error: 'Некорректный формат JSON или ошибка сервера' }, { status: 400 }); }
}
