import { Category, Article, PaginatedResponse, ArticleWithCategory } from '@/types';

// URL для запросов внутри одного приложения Next.js
const BASE_URL = '/api';

// Вспомогательная функция для обработки ответов сервера
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
  }
  return response.json();
}

export const api = {

  //           =========================
  //           === Рубрики категории ===
  //           =========================

  // Получить список рубрик с пагинацией
  async getCategories(page = 1, limit = 10): Promise<PaginatedResponse<Category>> {
    const res = await fetch(`${BASE_URL}/categories?page=${page}&limit=${limit}`, { cache: 'no-store' });
    return handleResponse<PaginatedResponse<Category>>(res);
  },

  // Получить одну рубрику по ID (со статьями внутри)
  async getCategoryById(id: string): Promise<Category & { articles: Article[] }> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, { cache: 'no-store' });
    return handleResponse<Category & { articles: Article[] }>(res);
  },

  // Создать новую рубрику
  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Category>(res);
  },

  // PATCH
  // Обновить рубрику частично
  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Category>(res);
  },

  // Удалить рубрику
  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },

  //              ======================
  //              === СТАТЬИ артиклы ===
  //              ======================

  // Получить список статей с пагинацией, поиском " ?q= " и фильтром по рубрике " ?categoryId=) "
  async getArticles(page = 1, limit = 10, search = '', categoryId = ''): Promise<PaginatedResponse<ArticleWithCategory>> {
    const url = new URL(`${window.location.origin}${BASE_URL}/articles`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (search) url.searchParams.append('q', search);
    if (categoryId) url.searchParams.append('categoryId', categoryId);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    return handleResponse<PaginatedResponse<ArticleWithCategory>>(res);
  },

  // Получить одну статью по ID (с вложенной рубрикой)
  async getArticleById(id: string): Promise<ArticleWithCategory> {
    const res = await fetch(`${BASE_URL}/articles/${id}`, { cache: 'no-store' });
    return handleResponse<ArticleWithCategory>(res);
  },

  // Создать статью
  async createArticle(data: Partial<Article>): Promise<Article> {
    const res = await fetch(`${BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Article>(res);
  },

  // PATCH
  // Обновить статью частично
  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    const res = await fetch(`${BASE_URL}/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Article>(res);
  },

  // Удалить статью
  async deleteArticle(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/articles/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },
};
