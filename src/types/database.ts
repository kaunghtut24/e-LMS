export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          type: 'employer' | 'educational_institution' | 'training_provider'
          industry: string | null
          size: string | null
          logo_url: string | null
          website: string | null
          description: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'employer' | 'educational_institution' | 'training_provider'
          industry?: string | null
          size?: string | null
          logo_url?: string | null
          website?: string | null
          description?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'employer' | 'educational_institution' | 'training_provider'
          industry?: string | null
          size?: string | null
          logo_url?: string | null
          website?: string | null
          description?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'learner' | 'instructor' | 'mentor' | 'employer' | 'admin'
          account_type: 'b2c' | 'b2b'
          organization_id: string | null
          first_name: string
          last_name: string
          avatar_url: string | null
          bio: string
          timezone: string
          language: string
          social_links: Json
          expertise: string[]
          preferences: Json
          status: 'active' | 'suspended' | 'pending'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
          last_login: string
        }
        Insert: {
          id: string
          email: string
          role?: 'learner' | 'instructor' | 'mentor' | 'employer' | 'admin'
          account_type?: 'b2c' | 'b2b'
          organization_id?: string | null
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          bio?: string
          timezone?: string
          language?: string
          social_links?: Json
          expertise?: string[]
          preferences?: Json
          status?: 'active' | 'suspended' | 'pending'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'learner' | 'instructor' | 'mentor' | 'employer' | 'admin'
          account_type?: 'b2c' | 'b2b'
          organization_id?: string | null
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          bio?: string
          timezone?: string
          language?: string
          social_links?: Json
          expertise?: string[]
          preferences?: Json
          status?: 'active' | 'suspended' | 'pending'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          parent_id: string | null
          order_index: number
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          order_index?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          order_index?: number
          is_active?: boolean
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          parent_skill_id: string | null
          market_demand: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          parent_skill_id?: string | null
          market_demand?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          parent_skill_id?: string | null
          market_demand?: number
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          long_description: string | null
          instructor_id: string
          organization_id: string | null
          category_id: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          thumbnail_url: string | null
          video_preview_url: string | null
          price: number
          currency: string
          language: string
          duration_hours: number
          tags: string[]
          requirements: string[]
          learning_outcomes: string[]
          target_skills: string[]
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          access_type: 'public' | 'organization' | 'private'
          enrollment_limit: number | null
          metadata: Json
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          long_description?: string | null
          instructor_id: string
          organization_id?: string | null
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          thumbnail_url?: string | null
          video_preview_url?: string | null
          price?: number
          currency?: string
          language?: string
          duration_hours?: number
          tags?: string[]
          requirements?: string[]
          learning_outcomes?: string[]
          target_skills?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          access_type?: 'public' | 'organization' | 'private'
          enrollment_limit?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          long_description?: string | null
          instructor_id?: string
          organization_id?: string | null
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          thumbnail_url?: string | null
          video_preview_url?: string | null
          price?: number
          currency?: string
          language?: string
          duration_hours?: number
          tags?: string[]
          requirements?: string[]
          learning_outcomes?: string[]
          target_skills?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          access_type?: 'public' | 'organization' | 'private'
          enrollment_limit?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          duration_minutes: number
          is_locked: boolean
          prerequisites: string[]
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number
          duration_minutes?: number
          is_locked?: boolean
          prerequisites?: string[]
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          duration_minutes?: number
          is_locked?: boolean
          prerequisites?: string[]
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          course_id: string
          title: string
          description: string | null
          type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'document'
          content: Json
          duration_minutes: number
          order_index: number
          is_preview: boolean
          is_mandatory: boolean
          resources: Json[]
          transcript: string | null
        }
        Insert: {
          id?: string
          module_id: string
          course_id: string
          title: string
          description?: string | null
          type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'document'
          content?: Json
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
          is_mandatory?: boolean
          resources?: Json[]
          transcript?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          course_id?: string
          title?: string
          description?: string | null
          type?: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'document'
          content?: Json
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
          is_mandatory?: boolean
          resources?: Json[]
          transcript?: string | null
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          organization_id: string | null
          status: 'active' | 'completed' | 'dropped' | 'paused'
          progress_percentage: number
          enrolled_at: string
          started_at: string | null
          completed_at: string | null
          last_accessed_at: string
          time_spent_minutes: number
          access_expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          organization_id?: string | null
          status?: 'active' | 'completed' | 'dropped' | 'paused'
          progress_percentage?: number
          enrolled_at?: string
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
          time_spent_minutes?: number
          access_expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          organization_id?: string | null
          status?: 'active' | 'completed' | 'dropped' | 'paused'
          progress_percentage?: number
          enrolled_at?: string
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
          time_spent_minutes?: number
          access_expires_at?: string | null
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          enrollment_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          completion_percentage: number
          time_spent_minutes: number
          last_position: Json
          attempts: number
          best_score: number | null
          started_at: string | null
          completed_at: string | null
          last_accessed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          enrollment_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          completion_percentage?: number
          time_spent_minutes?: number
          last_position?: Json
          attempts?: number
          best_score?: number | null
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          enrollment_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          completion_percentage?: number
          time_spent_minutes?: number
          last_position?: Json
          attempts?: number
          best_score?: number | null
          started_at?: string | null
          completed_at?: string | null
          last_accessed_at?: string
        }
      }
      user_notes: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          content: string
          timestamp_seconds: number | null
          is_bookmarked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          content: string
          timestamp_seconds?: number | null
          is_bookmarked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          content?: string
          timestamp_seconds?: number | null
          is_bookmarked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
