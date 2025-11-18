// src/services/authService.ts
import { apiFetch } from './api';
import type { LoginPayload, LoginResponse } from '../types/auth';


export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
    try {
        return await apiFetch<LoginResponse>('/api/v1/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
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
