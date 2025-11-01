// ============================================
// Phase 3: Assessment & Evaluation System Types
// ============================================

export type AssessmentType = 'quiz' | 'exam' | 'assignment' | 'project' | 'survey';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank' | 'matching' | 'code';
export type AssessmentStatus = 'in_progress' | 'submitted' | 'graded' | 'expired';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// ============================================
// Core Assessment Types
// ============================================

export interface Assessment {
  id: string;
  course_id: string;
  created_by: string;
  title: string;
  description?: string;
  type: AssessmentType;
  instructions?: string;
  time_limit_minutes?: number;
  max_attempts: number;
  passing_score?: number;
  shuffle_questions: boolean;
  show_correct_answers: boolean;
  available_from?: string;
  available_until?: string;
  randomize_answers: boolean;
  total_points: number;
  weight: number;
  is_published: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relations
  questions?: AssessmentQuestion[];
  attempts?: AssessmentAttempt[];
  rubrics?: Rubric[];
  analytics?: AssessmentAnalytics;
  course?: Course;
  creator?: Profile;
}

// ============================================
// Question Types
// ============================================

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_type: QuestionType;
  question_text: string;
  question_data: QuestionData;
  points: number;
  explanation?: string;
  order_index: number;
  tags?: string[];
  difficulty: DifficultyLevel;
  created_at: string;

  // Relations
  assessment?: Assessment;
  responses?: AssessmentResponse[];
}

// Question data varies by question type
export interface QuestionData {
  // For multiple_choice
  options?: QuestionOption[];

  // For matching
  pairs?: MatchingPair[];

  // For fill_blank
  blanks?: FillBlank[];

  // For code
  language?: string;
  starter_code?: string;

  // For essay
  max_words?: number;
  min_words?: number;

  [key: string]: any;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct?: boolean;
  explanation?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface FillBlank {
  id: string;
  correct_answer: string;
  acceptable_answers?: string[];
}

// ============================================
// Attempt & Response Types
// ============================================

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  user_id: string;
  attempt_number: number;
  status: AssessmentStatus;
  started_at: string;
  submitted_at?: string;
  time_spent_seconds: number;
  score?: number;
  total_possible?: number;
  percentage?: number;
  passed?: boolean;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  metadata?: Record<string, any>;
  created_at: string;

  // Relations
  assessment?: Assessment;
  user?: Profile;
  responses?: AssessmentResponse[];
  rubric_assessments?: RubricAssessment[];
}

export interface AssessmentResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  answer_text?: string;
  answer_data?: Record<string, any>;
  is_correct?: boolean;
  points_earned: number;
  auto_graded: boolean;
  graded_at?: string;
  feedback?: string;
  created_at: string;

  // Relations
  attempt?: AssessmentAttempt;
  question?: AssessmentQuestion;
}

// ============================================
// Rubric Types
// ============================================

export interface Rubric {
  id: string;
  assessment_id?: string;
  title: string;
  description?: string;
  total_points: number;
  criteria: RubricCriterion[];
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Relations
  assessment?: Assessment;
  creator?: Profile;
  rubric_assessments?: RubricAssessment[];
}

export interface RubricCriterion {
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  name: string;
  points: number;
  description: string;
}

export interface RubricAssessment {
  id: string;
  attempt_id: string;
  rubric_id: string;
  evaluator_id?: string;
  scores: Record<string, number>; // criterion_name -> score
  total_score: number;
  max_score: number;
  percentage: number;
  overall_feedback?: string;
  evaluated_at: string;

  // Relations
  attempt?: AssessmentAttempt;
  rubric?: Rubric;
  evaluator?: Profile;
}

// ============================================
// Analytics Types
// ============================================

export interface AssessmentAnalytics {
  id: string;
  assessment_id: string;
  total_attempts: number;
  average_score?: number;
  median_score?: number;
  highest_score?: number;
  lowest_score?: number;
  pass_rate?: number;
  average_time_minutes?: number;
  question_stats?: Record<string, QuestionStats>;
  created_at: string;
  updated_at: string;

  // Relations
  assessment?: Assessment;
}

export interface QuestionStats {
  question_id: string;
  total_responses: number;
  correct_responses: number;
  incorrect_responses: number;
  average_score: number;
  common_mistakes?: string[];
}

// ============================================
// DTO Types (for API requests/responses)
// ============================================

export interface CreateAssessmentDTO {
  course_id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  instructions?: string;
  time_limit_minutes?: number;
  max_attempts?: number;
  passing_score?: number;
  shuffle_questions?: boolean;
  show_correct_answers?: boolean;
  available_from?: string;
  available_until?: string;
  randomize_answers?: boolean;
  weight?: number;
  settings?: Record<string, any>;
}

export interface CreateQuestionDTO {
  assessment_id: string;
  question_type: QuestionType;
  question_text: string;
  question_data: QuestionData;
  points: number;
  explanation?: string;
  tags?: string[];
  difficulty?: DifficultyLevel;
}

export interface SubmitAttemptDTO {
  responses: {
    question_id: string;
    answer_text?: string;
    answer_data?: Record<string, any>;
  }[];
}

export interface CreateRubricDTO {
  assessment_id?: string;
  title: string;
  description?: string;
  criteria: RubricCriterion[];
}

export interface GradeRubricDTO {
  scores: Record<string, number>;
  overall_feedback?: string;
}

// ============================================
// Form & UI Types
// ============================================

export interface QuestionFormData {
  question_type: QuestionType;
  question_text: string;
  points: number;
  explanation?: string;
  tags?: string[];
  difficulty: DifficultyLevel;
  question_data: QuestionData;
}

export interface AssessmentFormData {
  title: string;
  description?: string;
  type: AssessmentType;
  instructions?: string;
  time_limit_minutes?: number;
  max_attempts: number;
  passing_score?: number;
  shuffle_questions: boolean;
  show_correct_answers: boolean;
  available_from?: string;
  available_until?: string;
  randomize_answers: boolean;
  weight: number;
  questions: QuestionFormData[];
}

export interface TakeAssessmentState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  timeRemaining?: number;
  isSubmitting: boolean;
}

// ============================================
// Filter & Search Types
// ============================================

export interface AssessmentFilter {
  type?: AssessmentType;
  status?: 'draft' | 'published' | 'archived';
  course_id?: string;
  created_by?: string;
  date_range?: {
    from: string;
    to: string;
  };
}

export interface QuestionFilter {
  type?: QuestionType;
  difficulty?: DifficultyLevel;
  tags?: string[];
  assessment_id?: string;
}

// ============================================
// Utility Types
// ============================================

export interface AssessmentWithCourse extends Assessment {
  course: {
    id: string;
    title: string;
    thumbnail_url?: string;
  };
}

export interface AttemptWithDetails extends AssessmentAttempt {
  assessment: {
    id: string;
    title: string;
    type: AssessmentType;
    total_points: number;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  responses: (AssessmentResponse & {
    question: {
      id: string;
      question_text: string;
      question_type: QuestionType;
      points: number;
    };
  })[];
}

export interface QuestionWithResponses extends AssessmentQuestion {
  responses: (AssessmentResponse & {
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
  })[];
  analytics?: {
    total_responses: number;
    correct_responses: number;
    incorrect_responses: number;
    average_score: number;
  };
}

// Re-export related types
export type { Course, Profile } from './enhanced';
