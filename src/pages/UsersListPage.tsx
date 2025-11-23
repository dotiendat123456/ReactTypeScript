// src/pages/UsersListPage.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { userListService } from '@/services/userListService';
import type { User } from '@/types/user';
import './UsersList.css'; // optional: tự style

const UsersListPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [total, setTotal] = useState<number | null>(null);
    const [lastPage, setLastPage] = useState<number | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await userListService.list({
                limit,
                page,
                search,
                paginate: true, // dùng pagination của backend
                // nếu cần filter theo user_id hoặc furlough_approved_by thì thêm ở đây
                // userId: 1,
                // furloughApprovedBy: false,
            });

            setUsers(res.items);
            setTotal(res.pagination?.total ?? null);
            setLastPage(res.pagination?.last_page ?? null);
        } catch (err: any) {
            console.error('Fetch users list error:', err);
            setError(err?.message || 'Không lấy được danh sách người dùng.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]); // đổi page/limit thì tự load lại

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadUsers();
    };

    const canPrev = page > 1;
    const canNext = lastPage !== null ? page < lastPage : users.length === limit;

    return (
        <main className="container users-list-page">
            <section className="section-head">
                <h1>Danh sách người dùng</h1>

                <form
                    className="filter-row"
                    style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        type="text"
                        placeholder="Tìm theo tên / email / mã..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ minWidth: 220 }}
                    />

                    <select
                        value={limit}
                        onChange={e => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value={5}>5 / trang</option>
                        <option value={10}>10 / trang</option>
                        <option value={20}>20 / trang</option>
                    </select>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Đang tìm...' : 'Lọc'}
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            </section>

            <section className="users-list-section">
                {loading && <p>Đang tải danh sách...</p>}

                {!loading && users.length === 0 && !error && (
                    <p>Không có người dùng nào.</p>
                )}

                {!loading && users.length > 0 && (
                    <>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Avatar</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Phòng ban</th>
                                    <th>Chức danh</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>
                                            <img
                                                src={u.avatar_url || '/placeholder.png'}
                                                alt={u.name}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            {u.departments.map(d => d.name).join(', ') || '-'}
                                        </td>
                                        <td>
                                            {u.titles.map(t => t.description || t.level).join(', ') ||
                                                '-'}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${u.badge_name}`}>
                                                {u.status_name}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div
                            style={{
                                marginTop: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                Trang {page}
                                {lastPage && ` / ${lastPage}`}
                                {total !== null && ` • Tổng: ${total} user`}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    className="btn btn-ghost"
                                    type="button"
                                    disabled={!canPrev || loading}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    Trang trước
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    type="button"
                                    disabled={!canNext || loading}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default UsersListPage;
