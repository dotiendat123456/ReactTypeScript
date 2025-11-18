import { apiFetch } from './api';
import type { Category, CategoriesResponse } from '../types/category';

const CATEGORIES_PATH = '/api/v1/categories';

export async function fetchCategories(token?: string): Promise<Category[]> {
    // tuỳ bạn đang lưu token ở đâu, tạm lấy từ localStorage
    const authToken =
        token || localStorage.getItem('accessToken') || '';

    const res = await apiFetch<CategoriesResponse>(CATEGORIES_PATH, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
    });

    return res.data;
}

export const categoriesService = { fetch: fetchCategories };
