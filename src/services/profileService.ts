// src/services/profileService.ts
import { apiFetch } from './api';
import type { User, UserProfileResponse } from '@/types/user';

const ME_PROFILE_PATH = '/api/v1/profile';

/**
 * Lấy profile của tài khoản hiện tại (theo token đang đăng nhập)
 * Gọi: GET /api/v1/profile
 */
export async function fetchCurrentProfile(token?: string): Promise<User> {
    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    const res = await apiFetch<UserProfileResponse>(ME_PROFILE_PATH, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return res.data;
}

export const profileService = {
    fetchCurrent: fetchCurrentProfile,
};
