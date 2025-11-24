import type { User } from './user';

export interface PostMediaFile {
    name: string;
    file_name: string;
    uuid: string;
    preview_url: string;
    original_url: string;
    order: number;
    custom_properties: any[];
    extension: string;
    size: number;
}

export interface Post {
    id: number;
    content: any;
    comments_count: number | null;
    emotes_count: number | null;
    is_emoted: boolean;
    is_pinned: number | null;
    is_pinned_label: string;
    status_name: string;
    status_badge: string;
    user: User;
    survey: any | null;
    created_at: string;
    file_upload: string | null;
    // backend có lúc trả {}, có lúc trả []
    file_uploads: Record<string, PostMediaFile> | PostMediaFile[] | string | null;
    comments: any[];
}

export interface PostsListMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PostsListLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PostsListResponse {
    message: string;
    data: Post[];
    meta: PostsListMeta;
    links: PostsListLinks;
}

export interface CreatePostPayload {
    content: string;
    survey_id?: number | null;
}

/**
 * API tạo post đang trả:
 * { message: "...", data: [ { ...post } ] }
 * nên để cho chắc: data có thể là Post hoặc Post[]
 */
export interface CreatePostResponse {
    message: string;
    data: Post | Post[];
}
