// src/pages/MyProfile.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import { profileService } from '@/services/profileService';
import { avatarService } from '@/services/avatarService';
import type { User } from '@/types/user';
import { fileToBase64 } from '@/utils/file';
import './UserProfile.css';

const formatDate = (value: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('vi-VN');
};

interface PendingAvatar {
    name: string;
    base64: string;
}

const MyProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ảnh đang chọn nhưng CHƯA lưu
    const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await profileService.fetchCurrent();
                setUser(data);
            } catch (err: any) {
                console.error('Fetch current profile error:', err);
                setError(err?.message || 'Không lấy được thông tin tài khoản.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Khi chọn file, chỉ set preview + pendingAvatar, chưa gọi API
    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setError(null);

            // preview cho UI
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreviewUrl(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return objectUrl;
            });

            // chuẩn bị dữ liệu gửi API nhưng CHƯA gửi
            const base64 = await fileToBase64(file);
            setPendingAvatar({
                name: file.name,
                base64,
            });
        } catch (err: any) {
            console.error('Prepare avatar error:', err);
            setError(err?.message || 'Xử lý ảnh thất bại.');
        } finally {
            e.target.value = ''; // để sau này chọn lại được cùng 1 file
        }
    };

    // Nhấn nút "Lưu ảnh" mới gọi API update-avatar
    const handleSaveAvatar = async () => {
        if (!pendingAvatar) return;

        try {
            setUpdatingAvatar(true);
            setError(null);

            const updatedUser = await avatarService.update({
                user_avatar: {
                    name: pendingAvatar.name,
                    data: pendingAvatar.base64,
                },
            });

            setUser(updatedUser);
            // Sau khi lưu thành công thì clear pending
            setPendingAvatar(null);
            setAvatarPreviewUrl(null);
        } catch (err: any) {
            console.error('Update avatar error:', err);
            setError(err?.message || 'Cập nhật avatar thất bại.');
        } finally {
            setUpdatingAvatar(false);
        }
    };

    const handleCancelAvatar = () => {
        // Hủy ảnh đang chọn, quay lại avatar cũ
        if (avatarPreviewUrl) {
            URL.revokeObjectURL(avatarPreviewUrl);
        }
        setAvatarPreviewUrl(null);
        setPendingAvatar(null);
    };

    // Ảnh hiển thị: ưu tiên preview nếu đang chọn, không thì dùng avatar hiện tại
    const currentAvatarSrc =
        avatarPreviewUrl ||
        user?.avatar_url ||
        user?.background ||
        '/placeholder.png';

    return (
        <main className="container user-profile-page">
            <section className="section-head">
                <h1>Tài khoản của tôi</h1>
                {loading && <p>Đang tải thông tin...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>

            {user && !loading && !error && (
                <section className="user-profile-card">
                    <div className="user-profile-header">
                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <img
                                src={currentAvatarSrc}
                                alt={user.name}
                                className="user-avatar"
                            />

                            {/* Chọn ảnh */}
                            <label
                                className="btn btn-ghost"
                                style={{
                                    marginTop: 8,
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                }}
                            >
                                Chọn ảnh
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                    disabled={updatingAvatar}
                                />
                            </label>

                            {/* Khi đã chọn ảnh mới thì hiện nút Lưu / Hủy */}
                            {pendingAvatar && (
                                <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveAvatar}
                                        disabled={updatingAvatar}
                                    >
                                        {updatingAvatar ? 'Đang lưu...' : 'Lưu ảnh'}
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        type="button"
                                        onClick={handleCancelAvatar}
                                        disabled={updatingAvatar}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            <p>
                                Trạng thái:{' '}
                                <span className={`badge badge-${user.badge_name}`}>
                                    {user.status_name}
                                </span>
                            </p>
                            <p>
                                Lần đăng nhập gần nhất:{' '}
                                <strong>{formatDate(user.login_at)}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="user-profile-body">
                        <div className="user-section">
                            <h3>Thông tin cơ bản</h3>
                            <p>
                                Họ: <strong>{user.last_name}</strong>
                            </p>
                            <p>
                                Tên: <strong>{user.first_name}</strong>
                            </p>
                        </div>

                        <div className="user-section">
                            <h3>Phòng ban</h3>
                            {user.departments.length === 0 ? (
                                <p>Không có phòng ban.</p>
                            ) : (
                                <ul>
                                    {user.departments.map(d => (
                                        <li key={d.id}>{d.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="user-section">
                            <h3>Chức danh</h3>
                            {user.titles.length === 0 ? (
                                <p>Không có chức danh.</p>
                            ) : (
                                <ul>
                                    {user.titles.map(t => (
                                        <li key={t.id}>
                                            {t.level} - {t.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="user-section">
                            <h3>Vai trò</h3>
                            {user.roles.length === 0 ? (
                                <p>Không có vai trò.</p>
                            ) : (
                                <ul>
                                    {user.roles.map(r => (
                                        <li key={r.id}>{r.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {user.profile && (
                            <div className="user-section">
                                <h3>Hồ sơ chi tiết</h3>
                                <p>
                                    Ngày sinh:{' '}
                                    <strong>{formatDate(user.profile.birth)}</strong>
                                </p>
                                <p>
                                    Nơi sinh: <strong>{user.profile.birth_place}</strong>
                                </p>
                                <p>
                                    Giới tính: <strong>{user.profile.gender}</strong>
                                </p>
                                <p>
                                    CMND/CCCD:{' '}
                                    <strong>{user.profile.identification_number}</strong>
                                </p>
                                <p>
                                    Ngày cấp:{' '}
                                    <strong>
                                        {formatDate(user.profile.identification_date)}
                                    </strong>
                                </p>
                                <p>
                                    Nơi cấp:{' '}
                                    <strong>{user.profile.identification_place}</strong>
                                </p>
                                <p>
                                    Trình độ học vấn:{' '}
                                    <strong>{user.profile.education_level}</strong>
                                </p>
                                <p>
                                    Ngân hàng:{' '}
                                    <strong>
                                        {user.profile.bank_name} - {user.profile.bank_number}
                                    </strong>
                                </p>
                                <p>
                                    Người thân:{' '}
                                    <strong>
                                        {user.profile.relative_name} (
                                        {user.profile.relative_role}) -{' '}
                                        {user.profile.relative_number}
                                    </strong>
                                </p>
                            </div>
                        )}

                        <div className="user-section">
                            <h3>Kỹ năng</h3>
                            {user.skills.length === 0 ? (
                                <p>Chưa có kỹ năng nào.</p>
                            ) : (
                                <ul>
                                    {user.skills.map(s => (
                                        <li key={s.id}>{s.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default MyProfile;
