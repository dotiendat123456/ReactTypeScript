// src/pages/CreatePostPage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { postsService } from '@/services/postsService';
import type { Post } from '@/types/post';
import './CreatePostPage.css';

const CreatePostPage: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [surveyId, setSurveyId] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [createdPost, setCreatedPost] = useState<Post | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        setFiles(selected);
        setSuccess(null);
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        setCreatedPost(null);

        try {
            const post = await postsService.create(
                {
                    content,
                    survey_id: surveyId ? Number(surveyId) : undefined,
                },
                files.length > 0 ? files : undefined
            );

            setCreatedPost(post);
            setSuccess('Tạo bài đăng thành công.');
            setContent('');
            setSurveyId('');
            setFiles([]);
        } catch (err: any) {
            console.error('Create post error:', err);
            setError(err?.message || 'Tạo bài đăng thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="container create-post-page">
            <section className="section-head">
                <h1>Tạo bài đăng mới</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </section>

            <section className="create-post-section">
                <form className="create-post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nội dung bài đăng</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={5}
                            placeholder="Nhập nội dung bài viết..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Survey ID (tùy chọn)
                            <span style={{ fontWeight: 400, fontSize: 12 }}>
                                {' '}
                                – để trống nếu không gắn survey
                            </span>
                        </label>
                        <input
                            type="number"
                            value={surveyId}
                            onChange={e => setSurveyId(e.target.value)}
                            min={1}
                            placeholder="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>File đính kèm (tùy chọn)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        {files.length > 0 && (
                            <p style={{ fontSize: 13, marginTop: 4 }}>
                                Đã chọn {files.length} file.
                            </p>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Đang tạo...' : 'Tạo bài đăng'}
                    </button>
                </form>
            </section>

            {createdPost && (
                <section className="created-preview">
                    <h2>Xem nhanh bài vừa tạo</h2>
                    <p>ID: {createdPost.id ?? '(API không trả ID)'}</p>
                    <p>
                        Trạng thái:{' '}
                        {createdPost.status_name ?? '(API không trả status_name)'}
                    </p>
                    <div
                        className="post-preview-content"
                        dangerouslySetInnerHTML={{
                            __html: String(createdPost.content ?? ''),
                        }}
                    />
                </section>
            )}
        </main>
    );
};

export default CreatePostPage;
