import { Category, Article } from '@/types';

// Рубрики
export let categories: Category[] = [
  { 
    id: 'n1', 
    name: 'JavaScript', 
    description: 'Язык программирования для веба',
    articlesCount: 2,
    isArchived: false,
    createdAt: new Date('2026-06-01').toISOString(),
    updatedAt: new Date('2026-06-01').toISOString()
  },
  { 
    id: 'n2', 
    name: 'Python', 
    description: 'Популярный язык для анализа данных',
    articlesCount: 1,
    isArchived: false,
    createdAt: new Date('2026-06-02').toISOString(),
    updatedAt: new Date('2026-06-02').toISOString()
  },
  { 
    id: 'n3', 
    name: 'React', 
    description: 'Библиотека для интерфейсов',
    articlesCount: 1,
    isArchived: false,
    createdAt: new Date('2026-06-03').toISOString(),
    updatedAt: new Date('2026-06-03').toISOString()
  },
  { 
    id: 'n4', 
    name: 'TypeScript', 
    description: 'JavaScript с типами',
    articlesCount: 1,
    isArchived: false,
    createdAt: new Date('2026-06-04').toISOString(),
    updatedAt: new Date('2026-06-04').toISOString()
  },
  { 
    id: 'n5', 
    name: 'Next.js', 
    description: 'Fullstack фреймворк',
    articlesCount: 1,
    isArchived: true, // Проверка логики работы булевых значений
    createdAt: new Date('2026-06-05').toISOString(),
    updatedAt: new Date('2026-06-05').toISOString()
  },
];

 // Статьи
export let articles: Article[] = [
  { 
    id: 'm1', 
    title: 'Основы JavaScript', 
    content: 'JavaScript — это язык программирования, который делает страницы живыми...', 
    categoryId: 'n1', 
    views: 45, 
    isPublished: true,
    publishedAt: new Date('2026-06-06').toISOString(),
    createdAt: new Date('2026-06-06').toISOString(),
    updatedAt: new Date('2026-06-06').toISOString()
  },
  { 
    id: 'm2', 
    title: 'Функции в JS', 
    content: 'Функции — это основные строительные блоки программы...', 
    categoryId: 'n1', 
    views: 32, 
    isPublished: true,
    publishedAt: new Date('2026-06-06').toISOString(),
    createdAt: new Date('2026-06-06').toISOString(),
    updatedAt: new Date('2026-06-06').toISOString()
  },
  { 
    id: 'm3', 
    title: 'Переменные в Python', 
    content: 'В Python переменные объявляются простым присваиванием значения...', 
    categoryId: 'n2', 
    views: 28, 
    isPublished: true,
    publishedAt: new Date('2026-06-07').toISOString(),
    createdAt: new Date('2026-06-07').toISOString(),
    updatedAt: new Date('2026-06-07').toISOString()
  },
  { 
    id: 'm4', 
    title: 'useState Hook', 
    content: 'useState позволяет добавить внутреннее состояние React-компоненту...', 
    categoryId: 'n3', 
    views: 67, 
    isPublished: true,
    publishedAt: new Date('2026-06-08').toISOString(),
    createdAt: new Date('2026-06-08').toISOString(),
    updatedAt: new Date('2026-06-08').toISOString()
  },
  { 
    id: 'm5', 
    title: 'Типы в TypeScript', 
    content: 'Основные типы данных включают string, number, boolean, а any лучше избегать...', 
    categoryId: 'n4', 
    views: 53, 
    isPublished: false, // Не опубликована
    createdAt: new Date('2026-06-09').toISOString(),
    updatedAt: new Date('2026-06-09').toISOString()
  },
  { 
    id: 'm6', 
    title: 'App Router в Next.js 14', 
    content: 'App Router — новая и более удобная система маршрутизации на основе папок...', 
    categoryId: 'n5', 
    views: 41, 
    isPublished: true,
    publishedAt: new Date('2026-06-09').toISOString(),
    createdAt: new Date('2026-06-09').toISOString(),
    updatedAt: new Date('2026-06-09').toISOString()
  },
];

// Вспомогательные функции
export const db = {
  updateCategoriesStore: (newStore: Category[]) => { categories = newStore; },
  updateArticlesStore: (newStore: Article[]) => { articles = newStore; }
};
