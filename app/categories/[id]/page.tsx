'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Category, Article } from '@/types';

type CategoryWithArticles = Category & { articles?: Article[] };

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<CategoryWithArticles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        setCategory(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!category) return <div>Рубрика не найдена</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description || 'Нет описания'}</p>
        </div>
        <Link href={`/categories/${id}/edit`} className="bg-green-500 text-white px-4 py-2 rounded">
          Редактировать
        </Link>
      </div>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Статьи в этой рубрике</h2>
      
      <div className="grid gap-4">
        {category.articles?.length === 0 ? (
          <p className="text-gray-500">Нет статей в этой рубрике</p>
        ) : (
          category.articles?.map(article => (
            <div key={article.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-gray-600 line-clamp-2">{article.content}</p>
              <Link href={`/articles/${article.id}/edit`} className="text-blue-500 mt-2 inline-block">
                Редактировать статью
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}