// TypeScript Types for Phase 1 & Phase 2 Features
// Add these to your existing types

import type { Course, Profile, Skill } from './index';

// Quiz Question type (if not already defined)
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'code';
  options?: string[];
  correct_answer: number | string;
  points: number;
  skill_id?: string;
}

// ============================================
// PHASE 1: PORTFOLIO & ACHIEVEMENTS
// ============================================

export interface PortfolioProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  course_id?: string;
  assignment_id?: string;
  skills: string[];
  status: 'draft' | 'submitted' | 'reviewed' | 'published';
  visibility: 'private' | 'organization' | 'public';
  project_type?: 'course_project' | 'personal' | 'capstone' | 'hackathon';
  github_url?: string;
  live_demo_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  views_count: number;
  likes_count: number;
}

export interface PortfolioArtifact {
  id: string;
  project_id: string;
  type: 'image' | 'video' | 'document' | 'link' | 'code' | 'presentation';
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  file_size?: number;
  mime_type?: string;
  metadata: Record<string, any>;
  order_index: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  badge_image_url?: string;
  type: 'course_completion' | 'skill_mastery' | 'project_submission' | 'streak' | 'community' | 'special';
  criteria: Record<string, any>;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  is_active: boolean;
  is_hidden: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: Record<string, any>;
  achievement?: Achievement; // Joined data
}

export interface SkillEndorsement {
  id: string;
  user_id: string;
  skill_id: string;
  endorser_id: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  comment?: string;
  relationship: 'instructor' | 'mentor' | 'peer' | 'employer';
  is_verified: boolean;
  verified_by?: string;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  current_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  target_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress_percentage: number;
  courses_completed: number;
  projects_completed: number;
  assessments_passed: number;
  time_spent_minutes: number;
  last_practiced_at?: string;
  acquired_at: string;
  mastered_at?: string;
  acquired_from: 'course' | 'project' | 'assessment' | 'self_reported';
  source_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// PHASE 2: ADAPTIVE LEARNING
// ============================================

export interface PreAssessment {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  questions: QuizQuestion[]; // Reuse from existing types
  time_limit_minutes?: number;
  passing_score: number;
  skills_assessed: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PreAssessmentResult {
  id: string;
  assessment_id: string;
  user_id: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, any>;
  time_taken_minutes?: number;
  skill_scores: Record<string, number>;
  identified_gaps: string[];
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description?: string;
  target_role?: string;
  target_skills: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours?: number;
  required_skills?: string[];
  path_structure: PathStep[];
  is_template: boolean;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PathStep {
  id: string;
  type: 'course' | 'assessment' | 'project' | 'resource';
  item_id: string;
  title: string;
  description?: string;
  order: number;
  is_required: boolean;
  estimated_duration_hours?: number;
  skills_covered: string[];
}

export interface UserLearningPath {
  id: string;
  user_id: string;
  learning_path_id?: string;
  custom_title?: string;
  custom_structure?: PathStep[];
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  progress_percentage: number;
  current_step: number;
  total_steps: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  estimated_completion_date?: string;
  time_spent_minutes: number;
  courses_completed: number;
  skills_acquired: string[];
  created_at: string;
  updated_at: string;
  learning_path?: LearningPath; // Joined data
}

export interface SkillGap {
  id: string;
  user_id: string;
  skill_id: string;
  current_level: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  target_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  gap_size: 'small' | 'medium' | 'large';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommended_courses: string[];
  recommended_resources: Resource[];
  estimated_time_to_close_hours?: number;
  status: 'identified' | 'in_progress' | 'closed' | 'obsolete';
  identified_at: string;
  closed_at?: string;
  identified_by: 'pre_assessment' | 'course_performance' | 'self_reported' | 'employer_requirement' | 'system_analysis';
  source_id?: string;
  created_at: string;
  updated_at: string;
  skill?: Skill; // Joined data
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation' | 'tutorial' | 'book';
  description?: string;
}

export interface CoursePrerequisite {
  id: string;
  course_id: string;
  prerequisite_course_id?: string;
  prerequisite_skill_id?: string;
  is_required: boolean;
  minimum_skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  alternative_prerequisites?: string[];
  created_at: string;
}

export interface RecommendationLog {
  id: string;
  user_id: string;
  recommendation_type: 'course' | 'learning_path' | 'skill' | 'content';
  recommended_item_id: string;
  recommended_item_type: string;
  context: Record<string, any>;
  algorithm_version?: string;
  confidence_score?: number;
  shown_to_user: boolean;
  user_clicked: boolean;
  user_enrolled: boolean;
  user_completed: boolean;
  user_feedback?: 'helpful' | 'not_helpful' | 'irrelevant';
  recommended_at: string;
  clicked_at?: string;
  enrolled_at?: string;
  completed_at?: string;
}

// ============================================
// ENHANCED EXISTING TYPES
// ============================================

// Add to existing Skill interface
export interface SkillWithProgress extends Skill {
  user_skill?: UserSkill;
  endorsements?: SkillEndorsement[];
  gap?: SkillGap;
}

// Add to existing Profile interface
export interface ProfileWithPortfolio extends Profile {
  portfolio_projects?: PortfolioProject[];
  achievements?: UserAchievement[];
  skills?: UserSkill[];
  skill_gaps?: SkillGap[];
  learning_paths?: UserLearningPath[];
}

// Add to existing Course interface
export interface CourseWithPrerequisites extends Course {
  prerequisites?: CoursePrerequisite[];
  is_unlocked?: boolean; // Based on user's progress
  prerequisite_courses?: Course[];
  prerequisite_skills?: Skill[];
}

// ============================================
// UI STATE TYPES
// ============================================

export interface PortfolioState {
  projects: PortfolioProject[];
  selectedProject: PortfolioProject | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProjects: (userId: string) => Promise<void>;
  createProject: (project: Partial<PortfolioProject>) => Promise<void>;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  publishProject: (id: string) => Promise<void>;
  addArtifact: (projectId: string, artifact: Partial<PortfolioArtifact>) => Promise<void>;
}

export interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  
  // Actions
  loadAchievements: () => Promise<void>;
  loadUserAchievements: (userId: string) => Promise<void>;
  checkAndAwardAchievements: (userId: string) => Promise<void>;
}

export interface LearningPathState {
  paths: LearningPath[];
  userPaths: UserLearningPath[];
  currentPath: UserLearningPath | null;
  isLoading: boolean;
  
  // Actions
  loadLearningPaths: () => Promise<void>;
  loadUserPaths: (userId: string) => Promise<void>;
  startLearningPath: (userId: string, pathId: string) => Promise<void>;
  updateProgress: (userPathId: string, stepCompleted: number) => Promise<void>;
  generatePersonalizedPath: (userId: string, goal: string) => Promise<void>;
}

export interface SkillGapState {
  gaps: SkillGap[];
  isLoading: boolean;
  
  // Actions
  loadSkillGaps: (userId: string) => Promise<void>;
  analyzeSkillGaps: (userId: string) => Promise<void>;
  updateGapStatus: (gapId: string, status: SkillGap['status']) => Promise<void>;
  getRecommendations: (gapId: string) => Promise<Course[]>;
}

export interface PreAssessmentState {
  assessments: PreAssessment[];
  results: PreAssessmentResult[];
  currentAssessment: PreAssessment | null;
  isLoading: boolean;
  
  // Actions
  loadAssessments: () => Promise<void>;
  startAssessment: (assessmentId: string) => Promise<void>;
  submitAssessment: (assessmentId: string, answers: Record<string, any>) => Promise<void>;
  loadResults: (userId: string) => Promise<void>;
}

// ============================================
// DATABASE INSERT TYPES
// ============================================

export type PortfolioProjectInsert = Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count'>;
export type PortfolioArtifactInsert = Omit<PortfolioArtifact, 'id' | 'created_at'>;
export type UserSkillInsert = Omit<UserSkill, 'id' | 'created_at' | 'updated_at'>;
export type SkillGapInsert = Omit<SkillGap, 'id' | 'created_at' | 'updated_at'>;
export type UserLearningPathInsert = Omit<UserLearningPath, 'id' | 'created_at' | 'updated_at'>;
export type PreAssessmentResultInsert = Omit<PreAssessmentResult, 'id' | 'created_at'>;
