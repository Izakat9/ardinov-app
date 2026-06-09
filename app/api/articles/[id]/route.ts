import { NextRequest, NextResponse } from 'next/server';
import { articles, categories } from '@/lib/store';

// GET /api/articles/:id - получить одну статью
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = articles.find(a => a.id === params.id);
  
  if (!article) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
  }
  
  
  // В Article  поле - views: number - снизу его роль
  // Увеличиваем счётчик просмотров
  article.views += 1;
  const category = categories.find(c => c.id === article.categoryId);
  return NextResponse.json({ ...article, category });
}

// PUT /api/articles/:id - обновить статью
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = articles.findIndex(a => a.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
  }
  
  // Валидация
  if (!body.title) {
    return NextResponse.json({ error: 'Заголовок обязателен' }, { status: 422 });
  }
  if (!body.content) {
    return NextResponse.json({ error: 'Содержание обязательно' }, { status: 422 });
  }
  if (!body.categoryId) {
    return NextResponse.json({ error: 'Выберите рубрику' }, { status: 422 });
  }
  
  articles[index] = {
    ...articles[index], // Копируем старые поля и меняем на новое значение
    title: body.title,
    content: body.content,
    categoryId: body.categoryId,
    updatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(articles[index]);
}

// Удалить статью
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = articles.findIndex(a => a.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
  }
  
  articles.splice(index, 1);
  return NextResponse.json({ success: true });
}