'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category } from '@/types';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  // Select
  // Загружаем рубрики для выпадающего списка
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await api.getCategories(1, 100);
        setCategories(data.items.filter(c => !c.isArchived)); // Берем только неархивные
      } catch (err: any) {
        setError('Не удалось загрузить рубрики для списка');
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.createArticle({ title, content, categoryId, isPublished, views: 0 });
      router.push('/articles'); // Редирект после создания
    } catch (err: any) {
      setError(err.message || 'Ошибка создания статьи');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCats) return <div className="text-center py-10 text-gray-500 text-sm">Инициализация формы...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Написание новой статьи</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-xs">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
            Привязать к рубрике <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">-- Выберите рубрику из списка --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
            Заголовок статьи <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" required value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Например: Понимание хуков в React"/>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
            Содержание статьи <span className="text-red-500">*</span>
          </label>
          <textarea 
            rows={8} required value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Напишите развернутый обучающий текст..."/>
        </div>

        <div className="flex items-center">
          <input 
            id="isPublished" type="checkbox" checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 select-none">
            Опубликовать сразу (доступно для чтения)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button 
            type="button" onClick={() => router.push('/articles')}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md">
            Отмена
          </button>
          <button 
            type="submit" disabled={submitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-md transition-colors">
            {submitting ? 'Публикация...' : 'Сохранить статью'}
          </button>
        </div>
      </form>
    </div>
  );
}
