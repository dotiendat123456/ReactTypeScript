// src/services/avatarService.ts
import { apiFetch } from './api';
import type { User, UserProfileResponse } from '@/types/user';

const UPDATE_AVATAR_PATH = '/api/v1/user/update-avatar';

export interface UserAvatarPayload {
    user_avatar: {
        name: string;  // tên file (vd: avatar.png)
        data: string;  // chuỗi base64 (không cần data:image/...;base64,)
    };
}

/**
 * Cập nhật avatar user hiện tại
 * POST /api/v1/user/update-avatar
 */
export async function updateUserAvatar(
    payload: UserAvatarPayload,
    token?: string
): Promise<User> {
    const storedToken = localStorage.getItem('accessToken');
    const authToken = token ?? storedToken ?? '';

    if (!authToken) {
        throw new Error('Thiếu access token, vui lòng đăng nhập lại.');
    }

    const res = await apiFetch<UserProfileResponse>(UPDATE_AVATAR_PATH, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    return res.data; // giả định API trả lại user đã update
}

export const avatarService = {
    update: updateUserAvatar,
};
