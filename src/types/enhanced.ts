import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];

export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];

export type CourseModule = Database['public']['Tables']['course_modules']['Row'];
export type CourseModuleInsert = Database['public']['Tables']['course_modules']['Insert'];

export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type LessonInsert = Database['public']['Tables']['lessons']['Insert'];

export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert'];
export type EnrollmentUpdate = Database['public']['Tables']['enrollments']['Update'];

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert'];
export type LessonProgressUpdate = Database['public']['Tables']['lesson_progress']['Update'];

export type UserNote = Database['public']['Tables']['user_notes']['Row'];
export type UserNoteInsert = Database['public']['Tables']['user_notes']['Insert'];

export interface CourseWithDetails extends Course {
  instructor?: Profile;
  category_details?: Category;
  modules?: CourseModuleWithLessons[];
  enrollment_count?: number;
  average_rating?: number;
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons?: Lesson[];
}

export interface EnrollmentWithCourse extends Enrollment {
  course?: CourseWithDetails;
}

export interface LessonProgressWithDetails extends LessonProgress {
  lesson?: Lesson;
  enrollment?: Enrollment;
}

export interface ProfileWithOrganization extends Profile {
  organization?: Organization;
}

export interface LessonContent {
  video?: {
    url: string;
    transcript?: string;
  };
  text?: {
    content: string;
    images?: string[];
  };
  quiz?: {
    questions: QuizQuestion[];
    timeLimit?: number;
    passingScore: number;
  };
  assignment?: {
    instructions: string;
    submissionType: 'text' | 'file' | 'url';
    maxScore: number;
    rubric?: AssignmentRubric[];
  };
  interactive?: {
    htmlContent: string;
    interactions: any[];
  };
  document?: {
    fileUrl: string;
    fileName: string;
    fileType: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | boolean | string;
  explanation?: string;
  points?: number;
}

export interface AssignmentRubric {
  id: string;
  criterion: string;
  description: string;
  maxPoints: number;
}

export interface LearningPathRecommendation {
  user_id: string;
  recommended_courses: string[];
  skill_gaps: SkillGap[];
  next_steps: string[];
  confidence_score: number;
  reasoning: string;
}

export interface SkillGap {
  skill_id: string;
  skill_name: string;
  current_level: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  target_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'low' | 'medium' | 'high';
  recommended_courses: string[];
}

export interface UserAnalytics {
  user_id: string;
  total_enrollments: number;
  completed_courses: number;
  total_time_spent_minutes: number;
  average_progress: number;
  skills_acquired: string[];
  skill_levels: Record<string, string>;
  learning_velocity: number;
  engagement_score: number;
  last_active: string;
}

export interface CourseAnalytics {
  course_id: string;
  total_enrollments: number;
  active_learners: number;
  completion_rate: number;
  average_progress: number;
  average_time_to_complete: number;
  average_rating: number;
  dropout_rate: number;
  engagement_metrics: {
    avg_session_duration: number;
    notes_count: number;
    discussion_participation: number;
  };
}

export interface PortfolioProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  course_id?: string;
  assignment_id?: string;
  skills: string[];
  artifacts: PortfolioArtifact[];
  status: 'draft' | 'submitted' | 'reviewed' | 'published';
  visibility: 'private' | 'organization' | 'public';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface PortfolioArtifact {
  id: string;
  type: 'image' | 'video' | 'document' | 'link' | 'code';
  title: string;
  url: string;
  thumbnail_url?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Assessment {
  id: string;
  lesson_id: string;
  user_id: string;
  type: 'quiz' | 'assignment' | 'project';
  submission: any;
  score?: number;
  max_score: number;
  feedback?: string;
  graded_by?: string;
  status: 'pending' | 'submitted' | 'grading' | 'graded' | 'resubmit_requested';
  submitted_at?: string;
  graded_at?: string;
}

export interface MentorRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  focus_areas: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  lesson_id?: string;
  course_id?: string;
  message: string;
  context?: string;
  response?: string;
  timestamp: string;
  helpful?: boolean;
  metadata?: Record<string, any>;
}
