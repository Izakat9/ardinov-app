'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/categories/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Рубрика не найдена на сервере');
        return res.json();
      })
      .then(data => {
        setName(data.name ?? '');
        setDescription(data.description ?? '');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    
    if (res.ok) {
      router.refresh(); 
      router.push('/categories'); 
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center p-6">Загрузка данных...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Редактировать рубрику</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название *</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={name ?? ''} 
            onChange={e => setName(e.target.value)}/>
        </div>
        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description ?? ''} 
            onChange={e => setDescription(e.target.value)}/>
        </div>
        <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded">
          {submitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
