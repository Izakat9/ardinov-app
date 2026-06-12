// app/articles/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArticleWithCategory, Category } from '@/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Состояния фильтрации и пагинации
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Встроенный debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // При изменении строки поиска сбрасываем на 1 страницу
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Загрузка списков категорий для выпадающего списка
  useEffect(() => {
    async function loadFilters() {
      try {
        const catData = await api.getCategories(1, 100);
        setCategories(catData.items);
      } catch (err) {
        console.error('Ошибка загрузки фильтров', err);
      }
    }
    loadFilters();
  }, []);

  // Основная загрузка статей с учетом фильтров и страниц
  async function loadArticles() {
    try {
      setLoading(true);
      const data = await api.getArticles(page, 5, debouncedSearch, selectedCategory);
      setArticles(data.items);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, [page, debouncedSearch, selectedCategory]);

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Вы уверены, что хотите удалить статью "${title}"?`);
    if (!confirmed) return;

    try {
      await api.deleteArticle(id);
      loadArticles(); // Перезагрузка списка
    } catch (err: any) {
      alert(err.message || 'Ошибка удаления');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">База статей</h1>
          <p className="text-xs text-gray-500 mt-1">Найдено публикаций: {totalItems}</p>
        </div>
        <Link 
          href="/articles/new" 
          className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md transition-colors">
          ➕ Написать статью
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Поиск по тексту</label>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите название или текст..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Фильтр по рубрике</label>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">Все рубрики</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Загрузка статей...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm">
          Статьи не найдены по выбранным фильтрам.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                    {article.category?.name || 'Без рубрики'}
                  </span>
                  {!article.isPublished && (
                    <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
                      Черновик
                    </span>
                  )}
                </div>
                <Link href={`/articles/${article.id}`} className="block group">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <span>Просмотров: {article.views}</span>
                  <span>📅 {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 self-end sm:self-start shrink-0">
                <Link 
                  href={`/articles/${article.id}/edit`}
                  className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded transition-colors">
                  Изменить
                </Link>
                <button 
                  onClick={() => handleDelete(article.id, article.title)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded transition-colors">
                  Удалить
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              &larr; Назад
            </button>
            <span className="text-sm text-gray-500">Страница {page} из {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Далее &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
