import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/commentService';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<{
    [commentId: number]: boolean;
  }>({});
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getComments(postId);
        setComments(data.comments);
        setError(null);
      } catch (err: any) {
        setError(err.message || '댓글을 불러올 수 없습니다');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (content: string, image?: File | null) => {
    if (!user) {
      setError('로그인 후 댓글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const newComment = await commentService.createComment(postId, content, image);
      setComments([...comments, newComment]);
      setError(null);
    } catch (err: any) {
      setError(err.message || '댓글 작성에 실패했습니다');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplySubmit = async (
    parentCommentId: number,
    content: string,
    image?: File | null,
  ) => {
    if (!user) {
      setError('로그인 후 답글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const newReply = await commentService.createReply(parentCommentId, content, image);

      const addReplyRecursive = (
        arr: Comment[],
        parentId: number,
        reply: Comment,
      ): Comment[] => {
        return arr.map((c) => ({
          ...c,
          replies:
            c.id === parentId
              ? [...c.replies, reply]
              : addReplyRecursive(c.replies, parentId, reply),
        }));
      };

      setComments(addReplyRecursive(comments, parentCommentId, newReply));
      setError(null);
      setShowReplyForm({ ...showReplyForm, [parentCommentId]: false });
    } catch (err: any) {
      setError(err.message || '답글 작성에 실패했습니다');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);

      const deleteCommentRecursive = (arr: Comment[], id: number): Comment[] => {
        return arr
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            replies: deleteCommentRecursive(c.replies, id),
          }));
      };

      setComments(deleteCommentRecursive(comments, commentId));
      setError(null);
    } catch (err: any) {
      setError(err.message || '댓글 삭제에 실패했습니다');
    }
  };

  const handleToggleReplyForm = (commentId: number) => {
    setShowReplyForm({
      ...showReplyForm,
      [commentId]: !showReplyForm[commentId],
    });
  };

  return (
    <section>
      <div className="mb-6 flex items-baseline gap-2">
        <h3 className="font-display text-xl font-semibold text-ink-900">댓글</h3>
        <span className="text-sm font-semibold text-accent-600">
          {comments.length}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </div>
      )}

      {!user ? (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-5 py-4">
          <p className="text-sm text-ink-600">
            댓글을 작성하려면 로그인이 필요해요.
          </p>
        </div>
      ) : (
        <CommentForm onSubmit={handleCommentSubmit} loading={commentLoading} />
      )}

      {loading ? (
        <div className="space-y-3 py-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-ink-100 bg-ink-50/40"
            />
          ))}
        </div>
      ) : (
        <CommentList
          comments={comments}
          onDelete={handleDelete}
          onReplySubmit={handleReplySubmit}
          showReplyForm={showReplyForm}
          onToggleReplyForm={handleToggleReplyForm}
        />
      )}
    </section>
  );
}
