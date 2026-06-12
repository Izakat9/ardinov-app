'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.items || []); 
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Удалить рубрику?')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  if (loading) return <div className="text-center">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Рубрики</h1>
        <Link href="/categories/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          + Новая рубрика
        </Link>
      </div>

      <div className="grid gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <p className="text-gray-600">{cat.description || 'Нет описания'}</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/categories/${cat.id}`} className="text-blue-500">Просмотр</Link>
              <Link href={`/categories/${cat.id}/edit`} className="text-green-500">Редактировать</Link>
              <button onClick={() => handleDelete(cat.id)} className="text-red-500">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
