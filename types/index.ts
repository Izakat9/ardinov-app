//Рубрика
export interface Category {
    id: string;
    name: string;
    description?: string; 
}

// Статья
export interface Article{
    id: string;
    title: string;
    content: string;
    categoryId: string;
    views: number;
    updatedAt?: string;
    createdAt: string;
}