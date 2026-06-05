import { NextRequest, NextResponse } from 'next/server';
import { articles, categories } from '@/lib/store';
import { Article } from '@/types';

// GET /api/articles?search=&categoryId=
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId');
  
  let filtered: Article[] = [...articles];
  
  if (search) {
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (categoryId) {
    filtered = filtered.filter(a => a.categoryId === categoryId);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const itemsWithCategory = filtered.map(article => ({
    ...article,
    category: categories.find(c => c.id === article.categoryId)
  }));
  
  return NextResponse.json(itemsWithCategory);
}

// POST /api/articles - создать новую статью
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.title) {
    return NextResponse.json({ error: 'Заголовок обязателен' }, { status: 422 });
  }
  if (!body.content) {
    return NextResponse.json({ error: 'Содержание обязательно' }, { status: 422 });
  }
  if (!body.categoryId) {
    return NextResponse.json({ error: 'Выберите рубрику' }, { status: 422 });
  }
  
  const category = categories.find(c => c.id === body.categoryId);
  if (!category) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 422 });
  }
  
  const newArticle = {
    id: Date.now().toString(),
    title: body.title,
    content: body.content,
    categoryId: body.categoryId,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  
  articles.push(newArticle);
  return NextResponse.json(newArticle, { status: 201 });
}