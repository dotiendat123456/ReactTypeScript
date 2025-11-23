// src/services/userListService.ts
import { apiFetch } from './api';
import type { User, UsersListResponse } from '@/types/user';

const LIST_USERS_PATH = '/api/v1/user/list-users';

export interface ListUsersOptions {
    limit?: number;               // số lượng mỗi trang
    page?: number;                // trang hiện tại
    search?: string;              // từ khóa tìm kiếm
    userId?: number;              // user_id
    furloughApprovedBy?: boolean; // true | false
    paginate?: boolean;           // backend paginate hay không
    token?: string;               // truyền token custom nếu muốn
}

/**
 * Gọi API GET /api/v1/user/list-users
 * Ví dụ giống curl:
 * /api/v1/user/list-users?limit=10&page=1&search=123&user_id=1&furlough_approved_by=false&paginate=false
 */
export async function listUsers(
    options: ListUsersOptions = {}
): Promise<{
    items: User[];
    pagination: UsersListResponse['pagination'];
    message: string;
}> {
    const {
        limit = 10,
        page = 1,
        search,
        userId,
        furloughApprovedBy,
        paginate = false, // curl mẫu của bạn đang để false
        token,
    } = options;

    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    const query: Record<string, any> = {
        limit,
        page,
        paginate,
    };

    if (typeof search === 'string' && search.trim() !== '') {
        query.search = search.trim();
    }

    if (typeof userId === 'number') {
        query.user_id = userId;
    }

    if (typeof furloughApprovedBy === 'boolean') {
        query.furlough_approved_by = String(furloughApprovedBy); // "true"/"false"
    }

    const res = await apiFetch<UsersListResponse>(LIST_USERS_PATH, {
        query,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return {
        items: res.data,
        pagination: res.pagination ?? null,
        message: res.message,
    };
}

export const userListService = {
    list: listUsers,
};
