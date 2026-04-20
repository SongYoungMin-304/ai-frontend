import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import PostLikeButton from './PostLikeButton';

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
    <div className="border border-gray-300 rounded-lg p-6 mb-4 bg-white hover:shadow-md transition-shadow">
      <Link to={`/posts/${post.id}`} className="no-underline">
        <h3 className="m-0 mb-2 text-xl text-gray-800 break-words hover:text-blue-600">{post.title}</h3>
      </Link>

      <div className="flex gap-4 mb-3 text-sm text-gray-600">
        <span className="font-medium">{post.author.username}</span>
        <span className="text-gray-400">{formatDate(post.createdAt)}</span>
      </div>

      <div className="flex gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">조회 {post.viewCount}</span>
        <span className="flex items-center gap-1">댓글 {post.commentCount}</span>
        <PostLikeButton
          postId={post.id}
          initialLikeCount={post.likeCount || 0}
          initialIsLiked={post.isLiked || false}
        />
      </div>
    </div>
  );
};

export default PostCard;
