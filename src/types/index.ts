export interface User {
  id: string;
  email: string;
  password?: string; // Optional since we don't want to expose passwords in the UI
  role: 'admin' | 'instructor' | 'student';
  status?: 'active' | 'suspended'; // User account status
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  dateJoined: string;
  lastLogin: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
    dribbble?: string;
    behance?: string;
  };
  expertise?: string[];
  coursesCreated?: number;
  totalStudents?: number;
  rating?: number;
  enrolledCourses?: string[];
  completedCourses?: string[];
  wishlist?: string[];
  achievements?: Achievement[];
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  instructorId: string;
  instructorName: string;
  category: string;
  subCategory: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice: number;
  currency: string;
  thumbnail: string;
  videoPreview?: string;
  duration: string;
  totalLessons: number;
  totalStudents: number;
  rating: number;
  totalReviews: number;
  language: string;
  subtitles: string[];
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  features: string[];
  createdDate: string;
  lastUpdated: string;
  publishedDate: string;
  status: 'draft' | 'published' | 'archived';
  isPopular: boolean;
  isBestseller: boolean;
  difficulty: number;
  completionRate: number;
  averageCompletionTime: string;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  order: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'text' | 'assignment';
  duration: string;
  order: number;
  videoUrl?: string;
  transcript?: string;
  resources?: LessonResource[];
  questions?: QuizQuestion[];
  passingScore?: number;
  isPreview: boolean;
  isCompleted: boolean;
}

export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'markdown' | 'zip' | 'link';
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: number | boolean | string;
  explanation: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  lessonsCompleted: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedLesson: string;
  timeSpent: string;
  quizzesCompleted: string[];
  notes: Note[];
  bookmarks: string[];
  enrollmentDate: string;
  lastAccessDate: string;
}

export interface Note {
  lessonId: string;
  content: string;
  timestamp: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  progress: string;
}

export interface Discussion {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'admin' | 'instructor' | 'student';
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: DiscussionReply[];
  tags: string[];
  isPinned: boolean;
  isResolved: boolean;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'admin' | 'instructor' | 'student';
  content: string;
  timestamp: string;
  likes: number;
  isInstructorReply?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'image';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'course' | 'achievement' | 'system';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
}

export interface Skill {
  id: string;
  name: string;
  category_id?: string;
  description?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'learner' | 'instructor' | 'mentor' | 'employer' | 'admin';
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  expertise?: string[];
  organization_id?: string;
  account_type: 'b2c' | 'b2b';
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CourseRating {
  courseId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
}

export interface SearchFilters {
  category?: string;
  level?: string;
  duration?: string;
  price?: 'free' | 'paid' | 'all';
  rating?: number;
  language?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => void;
}

// Export Phase 3 types
export * from './phase3-assessment';
export * from './phase3-forums';
