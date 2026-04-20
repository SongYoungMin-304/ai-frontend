import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import CommentSection from '../components/CommentSection';
import PostLikeButton from '../components/PostLikeButton';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postId = parseInt(id || '0');
        const postData = await postService.getPostDetail(postId);
        setPost(postData);
      } catch (err: any) {
        setError('게시글을 불러올 수 없습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 py-8">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-100 text-red-800 p-4 rounded text-center mb-4">{error || '게시글을 찾을 수 없습니다'}</div>
          <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-200">
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-200 mb-8">
          ← 목록으로
        </button>

        <article className="bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-4xl m-0 mb-6 text-gray-800 leading-snug">{post.title}</h1>

          <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to={`/users/${post.author.id}`} className="text-blue-600 font-medium hover:underline">
                {post.author.username}
              </Link>
              <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">조회 {post.viewCount}</span>
              <span className="flex items-center gap-1">댓글 {post.commentCount}</span>
              <PostLikeButton
                postId={post.id}
                initialLikeCount={post.likeCount || 0}
                initialIsLiked={post.isLiked || false}
              />
            </div>
          </div>

          <div className="text-lg leading-relaxed text-gray-800 mb-8 break-words whitespace-pre-wrap">
            {post.content.split('\n').map((line, index) => (
              <p key={index} className="m-0 mb-4">{line}</p>
            ))}
          </div>

          {post.createdAt !== post.updatedAt && (
            <div className="pt-4 border-t border-gray-200 text-gray-400 text-xs">
              수정됨: {formatDate(post.updatedAt)}
            </div>
          )}
        </article>

        <div className="bg-white rounded-lg shadow-md mt-8 p-8">
          <CommentSection postId={post.id} />
        </div>

        <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-200 mt-8">
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;
