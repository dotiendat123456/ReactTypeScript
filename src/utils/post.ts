// src/utils/post.ts
import type { Post, PostMediaFile } from '@/types/post';

/**
 * Chuẩn hoá content bài post thành HTML string.
 */
export const resolvePostContentHtml = (raw: any): string => {
    if (raw == null) return '';

    // Nếu API trả object
    if (typeof raw === 'object') {
        const maybeUserContent =
            (raw as any).user_content ||
            (raw as any).content ||
            (raw as any).message ||
            (raw as any).description;

        if (typeof maybeUserContent === 'string') return maybeUserContent;
        return JSON.stringify(raw);
    }

    const text = String(raw).trim();

    // Nếu là JSON string → parse ra lấy field content
    if (text.startsWith('{') || text.startsWith('[')) {
        try {
            const parsed = JSON.parse(text);
            const maybeUserContent =
                (parsed as any).user_content ||
                (parsed as any).content ||
                (parsed as any).message ||
                (parsed as any).description;

            if (typeof maybeUserContent === 'string') {
                return maybeUserContent;
            }

            return JSON.stringify(parsed, null, 2);
        } catch {
            return text;
        }
    }

    // Chuỗi thường / HTML
    return text;
};

const FILE_BASE =
    import.meta.env.VITE_FILE_BASE_URL || 'https://khgc-system.khgc.dev';

/**
 * Lấy URL ảnh bài đăng từ file_upload / file_uploads.
 */
export const getPostImageUrl = (post: Post): string | null => {
    let imageUrl: string | null = null;

    // 1. Ưu tiên file_uploads
    if (post.file_uploads) {
        let files: PostMediaFile[] = [];

        if (Array.isArray(post.file_uploads)) {
            files = post.file_uploads as PostMediaFile[];
        } else if (typeof post.file_uploads === 'object') {
            files = Object.values(
                post.file_uploads as Record<string, PostMediaFile>
            );
        }

        if (files.length > 0) {
            const f = files[0];
            imageUrl = f.original_url || f.preview_url || null;
        }
    }

    // 2. Fallback sang file_upload (string path)
    if (!imageUrl && post.file_upload) {
        const path = post.file_upload;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            imageUrl = path;
        } else {
            imageUrl = FILE_BASE.replace(/\/$/, '') + path;
        }
    }

    if (!imageUrl || !String(imageUrl).trim()) return null;
    return imageUrl;
};

/**
 * Bóc object Post từ nhiều kiểu response khác nhau.
 */
export const extractPostFromResponse = (json: any): Post => {
    console.log('Post API response:', json);

    let data = json;

    // { message, data: ... }
    if (data && typeof data === 'object' && 'data' in data) {
        data = (data as any).data;
    }

    // data = [ { post } ]
    if (Array.isArray(data)) {
        return (data[0] ?? {}) as Post;
    }

    // data = { post: { ... } }
    if (data && typeof data === 'object' && 'post' in data) {
        return (data as any).post as Post;
    }

    // data = { ...post }
    return data as Post;
};
