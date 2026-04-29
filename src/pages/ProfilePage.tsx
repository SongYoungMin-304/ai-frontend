import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userId = parseInt(id || '0');
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError('사용자를 불러올 수 없습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="card animate-pulse p-10">
            <div className="flex gap-6">
              <div className="h-28 w-28 rounded-full bg-ink-100" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/3 rounded bg-ink-100" />
                <div className="h-4 w-2/3 rounded bg-ink-100" />
                <div className="h-4 w-1/2 rounded bg-ink-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen pt-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="card px-6 py-12 text-center text-sm font-medium text-rose-700">
            {error || '사용자를 찾을 수 없습니다'}
          </div>
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
    });
  };

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-6">
        <div className="card animate-fade-up overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-accent-100 via-accent-50 to-ink-50">
            <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.18),transparent_60%)]" />
          </div>

          <div className="px-8 pb-8 pt-0 sm:px-10">
            <div className="-mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-end">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-card-hover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-accent-500 to-accent-700 font-display text-4xl font-bold text-white shadow-card-hover">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}

              <div className="flex-1 pb-1">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
                  {user.username}
                </h1>
                <p className="mt-1 text-sm text-ink-500">{user.email}</p>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-700">
              {user.bio || '자기소개가 없습니다'}
            </p>

            <p className="mt-6 text-xs font-medium text-ink-400">
              가입일 · {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="card flex flex-col items-center justify-center px-6 py-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className="font-display text-4xl font-semibold tabular-nums text-ink-900">
              {user.postCount}
            </span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">
              Posts
            </span>
          </div>
          <div className="card flex flex-col items-center justify-center px-6 py-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className="font-display text-4xl font-semibold tabular-nums text-ink-900">
              {user.commentCount}
            </span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">
              Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
