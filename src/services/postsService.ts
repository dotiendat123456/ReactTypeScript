// src/services/postsService.ts
import { apiFetch, API_BASE } from './api';
import type {
    Post,
    PostsListResponse,
    CreatePostPayload,
    CreatePostResponse,
} from '@/types/post';
import { extractPostFromResponse } from '@/utils/post';

const POSTS_PATH = '/api/v1/posts';

export interface FetchPostsOptions {
    limit?: number;
    page?: number;
    search?: string;
    userId?: number;
    token?: string;
}

/**
 * Lấy danh sách bài post
 * GET /api/v1/posts?limit=&page=&search=&user_id=
 */
export async function fetchPosts(
    options: FetchPostsOptions = {}
): Promise<{
    items: Post[];
    meta: PostsListResponse['meta'];
    links: PostsListResponse['links'];
    message: string;
}> {
    const {
        limit = 10,
        page = 1,
        search,
        userId,
        token,
    } = options;

    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    const query: Record<string, any> = { limit, page };

    if (search?.trim()) query.search = search.trim();
    if (typeof userId === 'number') query.user_id = userId;

    const res = await apiFetch<PostsListResponse>(POSTS_PATH, {
        query,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return {
        items: res.data,
        meta: res.meta,
        links: res.links,
        message: res.message,
    };
}

/**
 * Lấy chi tiết 1 bài post theo id
 * GET /api/v1/posts/{id}
 */
export async function fetchPostById(id: number, token?: string): Promise<Post> {
    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    const res = await apiFetch<any>(`${POSTS_PATH}/${id}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return extractPostFromResponse(res);
}

/**
 * Tạo bài post mới
 * - Không file: gửi JSON
 * - Có file: multipart/form-data với name "fileUpload[]"
 */
export async function createPost(
    payload: CreatePostPayload,
    files?: File[],
    token?: string
): Promise<Post> {
    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    // Có file -> FormData
    if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('content', payload.content);
        if (payload.survey_id != null) {
            formData.append('survey_id', String(payload.survey_id));
        }

        files.forEach(file => {
            formData.append('fileUpload[]', file);
        });

        const base = API_BASE || window.location.origin;
        const url = new URL(POSTS_PATH, base).toString();

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`,
                // KHÔNG set Content-Type để browser tự set boundary
            },
            body: formData,
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || res.statusText);
        }

        const json = await res.json();
        return extractPostFromResponse(json);
    }

    // Không file -> JSON như docs
    const json = await apiFetch<CreatePostResponse | any>(POSTS_PATH, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return extractPostFromResponse(json);
}

export const postsService = {
    fetch: fetchPosts,
    fetchById: fetchPostById,
    create: createPost,
};
