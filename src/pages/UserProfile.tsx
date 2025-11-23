// src/pages/UserProfile.tsx
import React, { useState } from 'react';
import { usersService } from '@/services/usersService';
import type { User } from '@/types/user';
import './UserProfile.css'; // nếu cần style riêng, có thể tạo sau

const formatDate = (value: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('vi-VN');
};

const UserProfile: React.FC = () => {
    const [userId, setUserId] = useState<string>('204');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const handleFetch = async () => {
        const idNum = Number(userId);
        if (!idNum) {
            setError('ID không hợp lệ');
            setUser(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await usersService.fetchProfile(idNum);
            setUser(data);
        } catch (err: any) {
            console.error('Fetch profile error:', err);
            setError(err?.message || 'Không lấy được thông tin người dùng');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container user-profile-page">
            <section className="section-head">
                <h1>Thông tin người dùng</h1>

                <div className="filter-row" style={{ marginTop: 16 }}>
                    <label>
                        Nhập ID người dùng:&nbsp;
                        <input
                            type="number"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            style={{ width: 120 }}
                        />
                    </label>
                    <button
                        className="btn btn-primary"
                        style={{ marginLeft: 12 }}
                        onClick={handleFetch}
                        disabled={loading}
                    >
                        {loading ? 'Đang tải...' : 'Lấy thông tin'}
                    </button>
                </div>

                {error && (
                    <p style={{ color: 'red', marginTop: 8 }}>
                        {error}
                    </p>
                )}
            </section>

            {user && (
                <section className="user-profile-card">
                    <div className="user-profile-header">
                        <img
                            src={user.avatar_url || user.background || '/placeholder.png'}
                            alt={user.name}
                            className="user-avatar"
                        />
                        <div>
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            <p>
                                Trạng thái:{' '}
                                <span className={`badge badge-${user.badge_name}`}>
                                    {user.status_name}
                                </span>
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
                            <p>
                                Lần đăng nhập gần nhất:{' '}
                                <strong>{formatDate(user.login_at)}</strong>
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
                    </div>
                </section>
            )}
        </main>
    );
};

export default UserProfile;
