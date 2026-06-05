import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/store';

// GET /api/categories - вывод списка всех рубрик
export async function GET() {
  return NextResponse.json(categories);
}

// POST /api/categories - создание новой рубрики
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Проверка, что ''name'' есть
  if (!body.name) {
    return NextResponse.json({ error: 'Название обязательно' }, { status: 422 });
  }
  
  const newCategory = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description || '',
  };
  
  categories.push(newCategory);
  return NextResponse.json(newCategory, { status: 201 });
}