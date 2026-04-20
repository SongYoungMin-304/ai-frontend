export interface User {
  id: number;
  email: string;
  username: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  postCount: number;
  commentCount: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
}

export interface AuthResponse {
  id: number;
  email: string;
  username: string;
  profileImage?: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface PostsResponse {
  content: Post[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  parentCommentId?: number;
  replies: Comment[];
}

export interface CommentsResponse {
  comments: Comment[];
}
