import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = {
  title: 'База Знаний | статьи и рубрики',
  description: 'Клиент-серверное веб-приложение на Next.js',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-indigo-600 tracking-tight">
               База Знаний
            </Link>
            <nav className="flex space-x-6 font-medium text-sm text-gray-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Главная
              </Link>
              <Link href="/categories" className="hover:text-indigo-600 transition-colors">
                Рубрики
              </Link>
              <Link href="/articles" className="hover:text-indigo-600 transition-colors">
                Статьи
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400">
          <p>Проект выполнен студентом ИСП группы 1.31 Ардинов А.Т.</p>
          <p>По Тех. Заданию ИП Шарапов А.Е.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
