// import { apiFetch } from './api';
// import type { Product, ProductsResponse } from '../types/product';

// const PRODUCTS_PATH = '/api/v1/products';

// export async function fetchProducts(status = 1, token?: string): Promise<{
//     items: Product[];
//     pagination: ProductsResponse['pagination'];
//     message: string;
// }> {
//     // TODO: token nên lấy từ auth context / localStorage
//     const authToken =
//         token || localStorage.getItem('accessToken') || '';

//     const res = await apiFetch<ProductsResponse>(PRODUCTS_PATH, {
//         query: { status },
//         // api.ts cho phép override headers, vì rest spread sau cùng
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
//         },
//     });

//     return {
//         items: res.data,
//         pagination: res.pagination,
//         message: res.message,
//     };
// }

// export const productsService = { fetch: fetchProducts };


import { apiFetch } from './api';
import type { Product, ProductsResponse } from '../types/product';

const PRODUCTS_PATH = '/api/v1/products';

interface FetchProductsOptions {
    status?: number;
    categoryId?: number;
    token?: string;
}

export async function fetchProducts(
    options: FetchProductsOptions = {}
): Promise<{
    items: Product[];
    pagination: ProductsResponse['pagination'];
    message: string;
}> {
    const {
        status = 1,
        categoryId,
        token,
    } = options;

    const authToken =
        token || localStorage.getItem('accessToken') || '';

    const query: Record<string, any> = { status };

    if (categoryId) {
        query.category_id = categoryId; 
    }

    const res = await apiFetch<ProductsResponse>(PRODUCTS_PATH, {
        query,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
    });

    return {
        items: res.data,
        pagination: res.pagination,
        message: res.message,
    };
}

export const productsService = { fetch: fetchProducts };
