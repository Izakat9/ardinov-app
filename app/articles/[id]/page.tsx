'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  if (!id) return;
  
  let fetched = false; // Замок против двойного вызова

  if (!fetched) {
    fetch(`/api/articles/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Статья не найдена');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  return () => {
    fetched = true; // Запираем замок при размонтировании
  };
}, [id]);

  const handleDelete = async () => {
    if (confirm('Удалить эту статью?')) {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/articles');
      }
    }
  };

  if (loading) return <div className="text-center p-6">Загрузка статьи...</div>;
  if (error || !article) return <div className="text-center p-6 text-red-500">{error || 'Ошибка'}</div>;

  return (
    <div className="max-w-2xl mx-auto border p-6 rounded shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <Link href="/articles" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <div className="flex gap-2">
          <Link href={`/articles/${id}/edit`} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
            Редактировать
          </Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
            Удалить
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-xs text-gray-400 mb-4">
        Рубрика: <span className="font-semibold text-gray-600">{article.category?.name || 'Без рубрики'}</span> | Просмотров: {article.views}
      </div>
      <p className="text-gray-800 whitespace-pre-wrap">{article.content}</p>
    </div>
  );
}
