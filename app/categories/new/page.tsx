'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      router.push('/categories');
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка создания');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать рубрику</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название *</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}/>
        </div>
        
        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}/>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Сохранение...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}