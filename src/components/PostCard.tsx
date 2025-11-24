import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '@/types/post';
import { formatDateTime } from '@/utils/date';
import { resolvePostContentHtml, getPostImageUrl } from '@/utils/post';
import './PostCard.css';

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const imageUrl = getPostImageUrl(post);
  const htmlContent = resolvePostContentHtml(post.content);

  return (
    <article className="post-card">
      {/* 👇 Bấm vào đây sẽ sang /posts/:id */}
      <Link to={`/posts/${post.id}`} className="post-card-link">
        <header className="post-header">
          <div className="post-user">
            <img
              src={post.user.avatar_url || '/placeholder.png'}
              alt={post.user.name}
              className="post-user-avatar"
            />
            <div>
              <div className="post-user-name">{post.user.name}</div>
              <div className="post-date">
                {formatDateTime(post.created_at)}
              </div>
            </div>
          </div>
          <span className={`badge badge-${post.status_badge}`}>
            {post.status_name}
          </span>
        </header>

        {imageUrl && (
          <div className="post-image-wrapper">
            <img src={imageUrl} alt="Ảnh bài đăng" className="post-image" />
          </div>
        )}

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </Link>

      <footer className="post-footer">
        <span>👍 {post.emotes_count ?? 0}</span>
        <span>💬 {post.comments_count ?? 0}</span>
        {post.is_pinned === 1 && (
          <span className="post-pinned">📌 Đang ghim</span>
        )}
      </footer>
    </article>
  );
};

export default PostCard;
