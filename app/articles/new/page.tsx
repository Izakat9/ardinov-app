'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, categoryId }),
    });

    if (res.ok) {
      router.push('/articles');
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка создания');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать статью</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Заголовок *</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-1">Рубрика *</label>
          <select
            required
            className="w-full border p-2 rounded"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">Выберите рубрику</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Содержание *</label>
          <textarea
            required
            rows={10}
            className="w-full border p-2 rounded font-mono"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Создать статью'}
        </button>
      </form>
    </div>
  );
}