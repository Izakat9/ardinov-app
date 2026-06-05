import { Category, Article } from '@/types';

// ~ Рубрики 
export const categories: Category[] = [
  { id: 'n1', name: 'JavaScript', description: 'Язык программирования для веба' },
  { id: 'n2', name: 'Python', description: 'Популярный язык для анализа данных' },
  { id: 'n3', name: 'React', description: 'Библиотека для интерфейсов' },
  { id: 'n4', name: 'TypeScript', description: 'JavaScript с типами' },
  { id: 'n5', name: 'Next.js', description: 'Fullstack фреймворк' },
];

// ~ Статьи 
export const articles: Article[] = [
  { id: 'm1', title: 'Основы JavaScript', content: 'JavaScript — это язык программирования ...', categoryId: 'n1', views: 45, createdAt: new Date('2026-06-06').toISOString() },
  { id: 'm2', title: 'Функции в JS', content: 'Функции — это блоки кода ...', categoryId: 'n1', views: 32, createdAt: new Date('2026-06-06').toISOString() },
  { id: 'm3', title: 'Переменные в Python', content: 'В Python переменные объявляются ...', categoryId: 'n2', views: 28, createdAt: new Date('2026-06-07').toISOString() },
  { id: 'm4', title: 'useState Hook', content: 'useState позволяет добавить состояние ...', categoryId: 'n3', views: 67, createdAt: new Date('2026-06-08').toISOString() },
  { id: 'm5', title: 'Типы в TypeScript', content: 'string, number, boolean, any ...', categoryId: 'n4', views: 53, createdAt: new Date('2026-06-09').toISOString() },
  { id: 'm6', title: 'App Router в Next.js 14', content: 'App Router — новая система маршрутизации ...', categoryId: 'n5', views: 41, createdAt: new Date('2026-06-09').toISOString() },
];