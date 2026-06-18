import { NextRequest, NextResponse } from 'next/server';
import { categories, articles, db } from '@/lib/store';
// GET 
// получить одну рубрику со статьями
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 });
  }
  
  const categoryArticles = articles.filter(a => a.categoryId === id);
  
  return NextResponse.json({ ...category, articles: categoryArticles });
}
// PUT  
// обновить рубрику
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 }); }
    // Валидация типов данных
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
      return NextResponse.json({ error: 'Поле "name" должно быть непустой строкой' }, { status: 422 }); 
    }
    if (body.description !== undefined && typeof body.description !== 'string') {
      return NextResponse.json({ error: 'Поле "description" должно быть строкой' }, { status: 422 }); 
    }
    if (body.isArchived !== undefined && typeof body.isArchived !== 'boolean') {
      return NextResponse.json({ error: 'Поле "isArchived" должно быть true или false' }, { status: 422 }); 
    }

    // Проверка уникальности имени, если оно меняется
    if (body.name && body.name.toLowerCase().trim() !== categories[index].name.toLowerCase()) {
      const isDuplicate = categories.some(c => c.name.toLowerCase().trim() === body.name.toLowerCase().trim());
      if (isDuplicate) {
        return NextResponse.json({ error: 'Рубрика с таким названием уже существует' }, { status: 422 }); 
      }
    }
    
    categories[index] = {                 
      ...categories[index],                                                                                  // 1. Берём старые данные рубрики
      name: body.name !== undefined ? body.name.trim() : categories[index].name,                             // 2. Меняем name на новое из запроса
      description: body.description !== undefined ? body.description.trim() : categories[index].description, // 3. Меняем description (или оставляем старое)
      isArchived: body.isArchived !== undefined ? body.isArchived : categories[index].isArchived,
      updatedAt: new Date().toISOString() 
    };
    
    return NextResponse.json(categories[index]); 
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обработки запроса' }, { status: 400 }); 
  }
}

// DELETE~ 
// удалить рубрику
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Рубрика не найдена' }, { status: 404 }); 
  }
  
  categories.splice(index, 1);

  const filteredArticles = articles.filter(a => a.categoryId !== id);
  db.updateArticlesStore(filteredArticles);
  
  return NextResponse.json({ success: true });
}
