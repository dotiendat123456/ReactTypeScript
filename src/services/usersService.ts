// src/services/usersService.ts
import { apiFetch } from './api';
import type { User, UserProfileResponse } from '@/types/user';

const PROFILE_PATH = '/api/v1/get-profile';

export async function fetchUserProfile(
    id: number,
    token?: string
): Promise<User> {
    const authToken =
        token || localStorage.getItem('accessToken') || '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    console.log('DEBUG userService authToken =', authToken);

    const res = await apiFetch<UserProfileResponse>(`${PROFILE_PATH}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
    });

    return res.data;
}


export const usersService = {
    fetchProfile: fetchUserProfile,
};
