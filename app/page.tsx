import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">База Знаний</h1>
      <p className="text-xl text-gray-600 mb-8">
        Система для управления рубриками и статьями
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/categories" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Рубрики
        </Link>
        <Link href="/articles" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Статьи
        </Link>
      </div>
    </div>
  );
}