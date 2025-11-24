// src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsService } from '@/services/postsService';
import type { Post } from '@/types/post';
import { formatDateTime } from '@/utils/date';
import { resolvePostContentHtml, getPostImageUrl } from '@/utils/post';
import './PostDetailPage.css';

const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            setError('ID bài viết không hợp lệ.');
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await postsService.fetchById(numericId);
                setPost(data);
            } catch (err: any) {
                console.error('Fetch post detail error:', err);
                setError(err?.message || 'Không lấy được thông tin bài viết.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <main className="container post-detail-page">
                <p>Đang tải bài viết...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container post-detail-page">
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/posts" className="btn btn-ghost" style={{ marginTop: 12 }}>
                    Quay lại danh sách bài đăng
                </Link>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="container post-detail-page">
                <p>Không tìm thấy bài viết.</p>
            </main>
        );
    }

    const imageUrl = getPostImageUrl(post);
    const htmlContent = resolvePostContentHtml(post.content);

    return (
        <main className="container post-detail-page">
            <section className="section-head">
                <h1>Chi tiết bài đăng #{post.id}</h1>
                <Link to="/posts" className="btn btn-ghost">
                    ← Quay lại danh sách
                </Link>
            </section>

            <section className="post-detail-card">
                <header className="post-header">
                    <div className="post-user">
                        <img
                            src={post.user.avatar_url || '/placeholder.png'}
                            alt={post.user.name}
                            className="post-user-avatar"
                        />
                        <div>
                            <div className="post-user-name">{post.user.name}</div>
                            <div className="post-user-email">{post.user.email}</div>
                            <div className="post-date">
                                Đăng lúc: {formatDateTime(post.created_at)}
                            </div>
                        </div>
                    </div>

                    <span className={`badge badge-${post.status_badge}`}>
                        {post.status_name}
                    </span>
                </header>

                {imageUrl && (
                    <div className="post-image-wrapper">
                        <img
                            src={imageUrl}
                            alt="Ảnh bài đăng"
                            className="post-image"
                        />
                    </div>
                )}

                <div
                    className="post-content large"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                <footer className="post-footer">
                    <span>👍 {post.emotes_count ?? 0}</span>
                    <span>💬 {post.comments_count ?? 0}</span>
                    {post.is_pinned === 1 && (
                        <span className="post-pinned">📌 Đang ghim</span>
                    )}
                </footer>
            </section>

            {/* Thông tin user chi tiết */}
            <section className="user-info-section">
                <h2>Thông tin người đăng</h2>
                <p>
                    Họ tên: <strong>{post.user.last_name} {post.user.first_name}</strong>
                </p>
                <p>
                    Trạng thái:{' '}
                    <span className={`badge badge-${post.user.badge_name}`}>
                        {post.user.status_name}
                    </span>
                </p>

                <div className="user-subsection">
                    <h3>Phòng ban</h3>
                    {post.user.departments?.length ? (
                        <ul>
                            {post.user.departments.map(d => (
                                <li key={d.id}>{d.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có phòng ban.</p>
                    )}
                </div>

                <div className="user-subsection">
                    <h3>Chức danh</h3>
                    {post.user.titles?.length ? (
                        <ul>
                            {post.user.titles.map(t => (
                                <li key={t.id}>
                                    {t.level} - {t.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có chức danh.</p>
                    )}
                </div>

                <div className="user-subsection">
                    <h3>Vai trò</h3>
                    {post.user.roles?.length ? (
                        <ul>
                            {post.user.roles.map(r => (
                                <li key={r.id}>{r.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có vai trò.</p>
                    )}
                </div>

                {post.user.profile && (
                    <div className="user-subsection">
                        <h3>Hồ sơ chi tiết</h3>
                        <p>Ngày sinh: <strong>{formatDateTime(post.user.profile.birth)}</strong></p>
                        <p>Nơi sinh: <strong>{post.user.profile.birth_place}</strong></p>
                        <p>Giới tính: <strong>{post.user.profile.gender}</strong></p>
                        <p>
                            CMND/CCCD: <strong>{post.user.profile.identification_number}</strong>
                        </p>
                        <p>
                            Ngày cấp:{' '}
                            <strong>{formatDateTime(post.user.profile.identification_date)}</strong>
                        </p>
                        <p>
                            Nơi cấp: <strong>{post.user.profile.identification_place}</strong>
                        </p>
                        <p>
                            Trình độ học vấn:{' '}
                            <strong>{post.user.profile.education_level}</strong>
                        </p>
                        <p>
                            Ngân hàng:{' '}
                            <strong>
                                {post.user.profile.bank_name} - {post.user.profile.bank_number}
                            </strong>
                        </p>
                        <p>
                            Người thân:{' '}
                            <strong>
                                {post.user.profile.relative_name} (
                                {post.user.profile.relative_role}) -{' '}
                                {post.user.profile.relative_number}
                            </strong>
                        </p>
                    </div>
                )}
            </section>

            {/* Khối survey nếu có */}
            {post.survey && (
                <section className="survey-section">
                    <h2>Khảo sát đính kèm</h2>
                    <h3>{post.survey.title}</h3>
                    <p>{post.survey.description}</p>
                    <p>
                        Thời gian:{' '}
                        <strong>
                            {post.survey.start_date} – {post.survey.end_date}
                        </strong>
                    </p>
                    <p>
                        Tổng lượt trả lời:{' '}
                        <strong>{post.survey.total_responses_count}</strong>
                    </p>

                    <div className="survey-questions">
                        {post.survey.survey_questions?.map((q: any) => (
                            <div key={q.id} className="survey-question">
                                <p>
                                    <strong>{q.question_text}</strong> ({q.question_type})
                                </p>
                                {q.options && (
                                    <ul>
                                        {q.options.map((opt: any) => (
                                            <li key={opt.id}>{opt.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default PostDetailPage;
