// src/pages/PostsListPage.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { postsService } from '@/services/postsService';
import type { Post } from '@/types/post';
import { useAuth } from '@/context/AuthContext';
import PostCard from '@/components/PostCard';
import './PostsListPage.css';``

const PostsListPage: React.FC = () => {
    const { user } = useAuth();

    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState<string>('');               // text đang gõ
    const [appliedSearch, setAppliedSearch] = useState<string>(''); // text đã apply filter
    const [limit, setLimit] = useState<number>(5);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [total, setTotal] = useState<number>(0);
    const [lastPage, setLastPage] = useState<number>(1);

    const loadPosts = async (
        pageArg: number,
        limitArg: number,
        searchArg: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const res = await postsService.fetch({
                limit: limitArg,
                page: pageArg,
                search: searchArg,
                userId: user?.id,
            });

            setPosts(res.items);
            setTotal(res.meta.total);
            setLastPage(res.meta.last_page);
        } catch (err: any) {
            console.error('Fetch posts error:', err);
            setError(err?.message || 'Không lấy được danh sách bài đăng.');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // load khi page / limit / appliedSearch đổi
    useEffect(() => {
        loadPosts(page, limit, appliedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, appliedSearch]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setAppliedSearch(search); // apply filter mới
        setPage(1);               // về trang 1
    };

    const canPrev = page > 1;
    const canNext = page < lastPage;

    return (
        <main className="container posts-list-page">
            <section className="section-head">
                <h1>Danh sách bài đăng</h1>

                <form
                    className="filter-row"
                    style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        type="text"
                        placeholder="Tìm theo nội dung..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ minWidth: 220 }}
                    />

                    <select
                        value={limit}
                        onChange={e => {
                            const newLimit = Number(e.target.value);
                            setLimit(newLimit);
                            setPage(1); // đổi limit thì về trang 1
                        }}
                    >
                        <option value={1}>1 / trang</option>
                        <option value={5}>5 / trang</option>
                        <option value={10}>10 / trang</option>
                    </select>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Đang tải...' : 'Lọc'}
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            </section>

            <section className="posts-list-section">
                {loading && <p>Đang tải danh sách bài đăng...</p>}

                {!loading && posts.length === 0 && !error && (
                    <p>Không có bài đăng nào.</p>
                )}

                {!loading && posts.length > 0 && (
                    <>
                        <div className="posts-list">
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        <div
                            style={{
                                marginTop: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                Trang {page} / {lastPage} • Tổng: {total} bài
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

export default PostsListPage;
