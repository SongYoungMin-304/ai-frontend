import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="post-card">
      <Link to={`/posts/${post.id}`} className="post-link">
        <h3 className="post-title">{post.title}</h3>
      </Link>

      <div className="post-meta">
        <span className="author">{post.author.username}</span>
        <span className="date">{formatDate(post.createdAt)}</span>
      </div>

      <div className="post-stats">
        <span className="view-count">조회 {post.viewCount}</span>
        <span className="comment-count">댓글 {post.commentCount}</span>
      </div>
    </div>
  );
};

export default PostCard;
