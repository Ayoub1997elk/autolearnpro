export enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  LEARNER = 'learner',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // The name of the icon component
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only for mock data
  enrolledCourseIds: number[];
  createdCourseIds?: number[];
  progress?: { [courseId: string]: number[] }; // courseId -> [lessonId, lessonId, ...]
  bio?: string;
  badges?: Badge[];
  learningStreak?: {
    current: number;
    lastLogin: string; // YYYY-MM-DD
  };
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: number; // in minutes
  imageUrl?: string;
  videoUrl?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  trainerId: number;
  trainerName: string;
  lessons: Lesson[];
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrollmentCount: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalLearners: number;
  totalTrainers: number;
  totalCourses: number;
  coursePopularity: { label: string; value: number }[];
  completionRates: { label: string; value: number }[];
}

export interface ForumReply {
    id: number;
    postId: number;
    authorId: number;
    authorName: string;
    content: string;
    createdAt: string;
}

export interface ForumPost {
    id: number;
    courseId: number;
    authorId: number;
    authorName: string;
    title: string;
    content: string;
    createdAt: string;
    replies: ForumReply[];
}

export interface TrainerAnalyticsData {
  totalEnrollments: number;
  avgCompletionRate: number;
  totalCourses: number;
  lessonDropOffs: { label: string; value: number }[];
}