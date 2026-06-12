import { NextRequest, NextResponse } from 'next/server';
import { articles, categories } from '@/lib/store';

// GET
// Получить одну статью со связанной рубрикой внутри
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
  }
  
  // Увеличиваем просмотры при каждом детальном просмотре
  article.views += 1;
  
  // Находим связанную сущность рубрики
  const category = categories.find(c => c.id === article.categoryId);
  
  return NextResponse.json({ 
    ...article, 
    category 
  });
}

// PATCH
// Частичное обновление статьи
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = articles.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    }
    
    // Валидация типов данных
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
      return NextResponse.json({ error: 'Поле "title" должно быть непустой строкой' }, { status: 422 });
    }
    if (body.content !== undefined && (typeof body.content !== 'string' || body.content.trim() === '')) {
      return NextResponse.json({ error: 'Поле "content" должно быть непустой строкой' }, { status: 422 });
    }
    if (body.categoryId !== undefined && typeof body.categoryId !== 'string') {
      return NextResponse.json({ error: 'Поле "categoryId" должно быть строкой ID' }, { status: 422 });
    }
    if (body.views !== undefined && typeof body.views !== 'number') {
      return NextResponse.json({ error: 'Поле "views" должно быть числом' }, { status: 422 });
    }
    if (body.isPublished !== undefined && typeof body.isPublished !== 'boolean') {
      return NextResponse.json({ error: 'Поле "isPublished" должно быть true или false' }, { status: 422 });
    }

    const timestamp = new Date().toISOString();
    const oldCategoryId = articles[index].categoryId;

    // Если меняется рубрика, проверяем её существование и обновляем счётчики связей
    if (body.categoryId && body.categoryId !== oldCategoryId) {
      const targetCategoryExists = categories.some(c => c.id === body.categoryId);
      if (!targetCategoryExists) {
        return NextResponse.json({ error: 'Указанная новая рубрика не найдена' }, { status: 422 });
      }
      
      // Уменьшаем счётчик статей у старой рубрики
      const oldCatIndex = categories.findIndex(c => c.id === oldCategoryId);
      if (oldCatIndex !== -1) {
        categories[oldCatIndex].articlesCount = Math.max(0, categories[oldCatIndex].articlesCount - 1);
        categories[oldCatIndex].updatedAt = timestamp;
      }
      
      // Увеличиваем счётчик статей у новой рубрики
      const newCatIndex = categories.findIndex(c => c.id === body.categoryId);
      if (newCatIndex !== -1) {
        categories[newCatIndex].articlesCount += 1;
        categories[newCatIndex].updatedAt = timestamp;
      }
    }

    // Обновляем поля статьи и прописываем дату изменения вручную*
    articles[index] = {
      ...articles[index],
      title: body.title !== undefined ? body.title.trim() : articles[index].title,
      content: body.content !== undefined ? body.content.trim() : articles[index].content,
      categoryId: body.categoryId !== undefined ? body.categoryId : articles[index].categoryId,
      views: body.views !== undefined ? body.views : articles[index].views,
      isPublished: body.isPublished !== undefined ? body.isPublished : articles[index].isPublished,
      updatedAt: timestamp,
    };
    
    return NextResponse.json(articles[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обработки JSON' }, { status: 400 });
  }
}

// DELETE
// Удаление статьи с уменьшением счётчика статей в её рубрике
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const index = articles.findIndex(a => a.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
  }
  
  const categoryId = articles[index].categoryId;
  
  // Удаляем статью из массива
  articles.splice(index, 1);
  
  // Находим рубрику этой статьи и уменьшаем счётчик её статей на 1
  const catIndex = categories.findIndex(c => c.id === categoryId);
  if (catIndex !== -1) {
    categories[catIndex].articlesCount = Math.max(0, categories[catIndex].articlesCount - 1);
    categories[catIndex].updatedAt = new Date().toISOString();
  }
  
  return NextResponse.json({ success: true });
}
