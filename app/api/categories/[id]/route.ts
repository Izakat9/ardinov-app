import { NextRequest, NextResponse } from 'next/server';
import { categories, articles } from '@/lib/store';

// GET /api/categories/:id - получить одну рубрику со статьями
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = categories.find(c => c.id === params.id);
  
  if (!category) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 });
  }
  
  const categoryArticles = articles.filter(a => a.categoryId === params.id);
  
  return NextResponse.json({ ...category, articles: categoryArticles });
}

// PUT /api/categories/:id - обновить рубрику
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = categories.findIndex(c => c.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 });
  }
  
  // Валидация: name обязателен
  if (!body.name) {
    return NextResponse.json({ error: 'Название обязательно' }, { status: 422 });
  }
  
  categories[index] = {                 
    ...categories[index],                                            // 1. Берём старые данные рубрики
    name: body.name,                                                 // 2. Меняем name на новое из запроса
    description: body.description || categories[index].description,  // 3. Меняем description (или оставляем старое)
  };
  
  return NextResponse.json(categories[index]);
}

// DELETE~ /api/categories/:id - удалить рубрику
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = categories.findIndex(c => c.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 });
  }
  
  categories.splice(index, 1);
  return NextResponse.json({ success: true });
}