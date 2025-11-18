export interface Product {
    id: number;
    code: string;
    name: string;
    product_type_label: string;
    product_type_badge: string;
    description: string;
    type: string;
    original_price: string;
    price: string;
    status: number;
    unit: string | null;
    weight: string;
    category_name: string | null;
    thumbnail: string | null;
    stock_total: number;
    allocated_total: number;
    available_total: number;
    product_variants_count: number;
    status_label: string;
    status_badge: string;
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ProductsResponse {
    message: string;
    data: Product[];
    pagination: Pagination;
}
