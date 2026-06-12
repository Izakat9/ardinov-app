import { NextRequest, NextResponse } from 'next/server';
import { articles, categories } from '@/lib/store';
import { Article, PaginatedResponse } from '@/types';

// Получение списка статей с поиском/фильтрацией и пагинацией
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры поиска " ?q= " и фильтрации " ?categoryId= "
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId') || '';
    
    // Получить номер страницы и лимит из запроса
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    
    let filtered: Article[] = [...articles];
    
    // 1 - Поиск по текстовым полям заголовок/контент
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) || 
        a.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 2 - Фильтрация по рубрике
    if (categoryId) {
      filtered = filtered.filter(a => a.categoryId === categoryId);
    }

    // Сортировка от new к old
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 3 - Пагинация
    // считаем количество страниц и берем нужный отрывок
    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);
    
    // Привязываем вложенную рубрику к каждой статье на текущей странице*
    const itemsWithCategory = paginatedItems.map(article => ({
      ...article,
      category: categories.find(c => c.id === article.categoryId)
    }));
    
    // Формируем ответ пагинации
    const response: PaginatedResponse<any> = {
      items: itemsWithCategory,
      total,
      page,
      pages,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// POST
// Создание новой статьи с полной валидацией*
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1 - Валидация на наличие обязательных полей и типов данных
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ error: 'Поле "title" обязательно и должно быть строкой' }, { status: 422 }); }
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json({ error: 'Поле "content" обязательно и должно быть строкой' }, { status: 422 }); }
    if (!body.categoryId || typeof body.categoryId !== 'string') {
      return NextResponse.json({ error: 'Поле "categoryId" обязательно для привязки статьи к рубрике' }, { status: 422 }); }
    if (body.views !== undefined && typeof body.views !== 'number') {
      return NextResponse.json({ error: 'Поле "views" должно быть числом' }, { status: 422 }); }
    if (body.isPublished !== undefined && typeof body.isPublished !== 'boolean') {
      return NextResponse.json({ error: 'Поле "isPublished" должно быть логического типа' }, { status: 422 }); }
    if (body.publishedAt !== undefined && typeof body.publishedAt !== 'string') {
      return NextResponse.json({ error: 'Поле "publishedAt" должно быть строкой даты' }, { status: 422 }); }

    // 2 - Проверка существования связанной сущности
    const categoryIndex = categories.findIndex(c => c.id === body.categoryId);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Указанная рубрика не найдена в системе' }, { status: 422 }); }
    
    // 3 - Сборка нового объекта
    const timestamp = new Date().toISOString();
    const isPublished = body.isPublished ?? true;

    const newArticle: Article = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      content: body.content.trim(),
      categoryId: body.categoryId,
      views: body.views ?? 0,
      isPublished,
      publishedAt: isPublished ? (body.publishedAt || timestamp) : undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    // Сохраняем
    articles.push(newArticle);
    
    // счетчик статей в рубрике
    categories[categoryIndex].articlesCount += 1;
    categories[categoryIndex].updatedAt = timestamp;
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Некорректный формат JSON или ошибка сервера' }, { status: 400 });
  }
}
