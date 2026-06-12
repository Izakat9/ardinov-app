// Рубрика
export interface Category {
  id: string;
  name: string;
  description?: string;
  articlesCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Статья
export interface Article {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  views: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Статья*
// детальная страница
export interface ArticleWithCategory extends Article {
  category?: Category;
}

// API с пагинацией
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
