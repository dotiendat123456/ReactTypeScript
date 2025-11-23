// src/services/authService.ts
import { apiFetch } from './api';
import type { LoginPayload, LoginResponse } from '../types/auth';

/**
 * Gọi API đăng nhập:
 * POST /api/v1/login
 *
 * - Gửi email/password (payload)
 * - Nhận về LoginResponse
 * - Tự động lưu access token vào localStorage với key 'accessToken'
 * - Nếu API có trả user thì có thể lưu luôn vào localStorage (tuỳ bạn dùng)
 */
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const res = await apiFetch<LoginResponse>('/api/v1/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        // Tuỳ API của bạn mà chỉnh lại đoạn này cho đúng field
        // Ví dụ Laravel thường trả:
        // {
        //   "message": "Đăng nhập thành công",
        //   "data": {
        //     "token": "....",
        //     "user": { ... }
        //   }
        // }
        // => ở đây mình ưu tiên res.data.token

        const anyRes = res as any;

        const token: string | undefined =
            anyRes?.data?.token ??
            anyRes?.token ??
            anyRes?.access_token;

        if (token) {
            // Lưu token cho các service khác dùng (usersService, productsService,...)
            localStorage.setItem('accessToken', token);
        }

        // Option: lưu luôn thông tin user nếu API trả về
        const user = anyRes?.data?.user ?? anyRes?.user;
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        }

        return res;
    } catch (err: any) {
        const raw = err?.message ?? 'Đăng nhập thất bại';
        const pretty = extractErrorMessage(raw) || 'Đăng nhập thất bại';
        throw new Error(pretty);
    }
}

function extractErrorMessage(maybeJson: string): string | null {
    if (typeof maybeJson !== 'string') return null;
    const trimmed = maybeJson.trim();
    if (!trimmed.startsWith('{')) return trimmed;
    try {
        const j = JSON.parse(trimmed);
        const fromErrors =
            j?.errors && Array.isArray(Object.values(j.errors))
                ? (Object.values(j.errors) as any[]).flat()?.[0]
                : undefined;
        return j?.message || fromErrors || null;
    } catch {
        return trimmed;
    }
}

export const authService = { loginRequest };
