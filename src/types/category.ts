export interface Category {
    id: number;
    locale_name: string;
}

export interface CategoriesResponse {
    message: string;
    data: Category[];
}
