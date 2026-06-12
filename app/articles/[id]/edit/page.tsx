'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@/types';

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.items || []);
      })
      .catch(() => setError('Не удалось загрузить список рубрик'));

    if (id) {
      fetch(`/api/articles/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Статья не найдена в системе');
          return res.json();
        })
        .then(data => {
          setTitle(data.title ?? '');
          setContent(data.content ?? '');
          setCategoryId(data.categoryId ?? '');
          setIsPublished(data.isPublished ?? true);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Ошибка инициализации данных');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, categoryId, isPublished }),
      });

      if (res.ok) {
        router.push('/articles');
      } else {
        const data = await res.json();
        setError(data.error || 'Не удалось сохранить изменения');
      }
    } catch (err) {
      setError('Сбой сетевого запроса к бэкенду');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка данных статьи...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактирование статьи</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Рубрика <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option value="">-- Выберите рубрику из списка --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Заголовок статьи *
          </label>
          <input
            type="text"
            required
            value={title ?? ''}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Содержание статьи *
          </label>
          <textarea
            rows={8}
            required
            value={content ?? ''}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/>
        </div>

        <div className="flex items-center">
          <input
            id="isPublished"
            type="checkbox"
            checked={isPublished ?? true}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 select-none">
            Опубликовано
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push('/articles')}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md">
            Отмена
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors">
            {submitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
