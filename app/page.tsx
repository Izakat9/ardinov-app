import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
        Система ведения базы знаний
      </h1>
      <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
        Разработано на Next.js, TypeScript и Tailwind CSS.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link 
          href="/categories" 
          className="p-6 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all bg-white group">
          <div className="text-2xl mb-2">&#128194;</div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
            Рубрики &rarr;
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Управление категориями знаний. Просмотр структуры, создание новых и архивация разделов.
          </p>
        </Link>

        <Link 
          href="/articles" 
          className="p-6 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all bg-white group">
          <div className="text-2xl mb-2">&#128196;</div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
            Статьи &rarr;
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Каталог обучающих материалов с возможностью полнотекстового поиска, фильтрации и пагинации.
          </p>
        </Link>
      </div>
    </div>
  );
}
