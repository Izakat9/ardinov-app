'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Article, Category } from '@/types';

type ArticleWithCategory = Article & { category?: Category };

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory) params.append('categoryId', selectedCategory);
    
    const res = await fetch(`/api/articles?${params.toString()}`);
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }, [search, selectedCategory]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  // Debounce для поиска (300ms)
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      fetchArticles();
    }, 300);
    setTimeoutId(id);
  }, [search, fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, fetchArticles]);

  const handleDelete = async (id: string) => {
    if (confirm('Удалить статью?')) {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Статьи</h1>
        <Link href="/articles/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          + Новая статья
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по заголовку..."
          className="border p-2 rounded flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Все рубрики</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="grid gap-4">
          {articles.map(article => (
            <div key={article.id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-blue-600 mb-1">
                    {article.category?.name || 'Без рубрики'}
                  </div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-600 line-clamp-2 mt-1">{article.content}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    👁️ {article.views} просмотров | 📅 {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/articles/${article.id}/edit`} className="text-green-500">
                    Редактировать
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-500">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="text-center text-gray-500">Нет статей</div>
          )}
        </div>
      )}
    </div>
  );
}