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

export enum Category {
  CAREER_CONSULTING = 'CAREER_CONSULTING',
  RESUME_REVIEW = 'RESUME_REVIEW',
  INTERVIEW_PREP = 'INTERVIEW_PREP',
  TECH_STACK = 'TECH_STACK',
  SALARY_NEGOTIATION = 'SALARY_NEGOTIATION',
  JOB_SEARCH = 'JOB_SEARCH',
}

export const CategoryLabels: Record<Category, string> = {
  [Category.CAREER_CONSULTING]: '진로 상담',
  [Category.RESUME_REVIEW]: '이력서 첨삭',
  [Category.INTERVIEW_PREP]: '면접 준비',
  [Category.TECH_STACK]: '기술 스택',
  [Category.SALARY_NEGOTIATION]: '연봉 협상',
  [Category.JOB_SEARCH]: '구직 정보',
};

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  category?: Category;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
  likeCount?: number;
  liked?: boolean;
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
  imageUrl?: string;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  parentCommentId?: number;
  replies: Comment[];
  likeCount?: number;
  liked?: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
}
