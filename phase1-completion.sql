-- Phase 1 Completion: Portfolio Builder & Enhanced Tracking
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. PORTFOLIO PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  assignment_id TEXT, -- Reference to lesson/assignment
  skills TEXT[] DEFAULT '{}', -- Skills demonstrated
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'published')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'organization', 'public')),
  
  -- Metadata
  project_type TEXT CHECK (project_type IN ('course_project', 'personal', 'capstone', 'hackathon')),
  github_url TEXT,
  live_demo_url TEXT,
  video_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0
);

-- ============================================
-- 2. PORTFOLIO ARTIFACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'link', 'code', 'presentation')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  metadata JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ACHIEVEMENTS/BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT, -- Icon name or URL
  badge_image_url TEXT,
  
  -- Achievement criteria
  type TEXT NOT NULL CHECK (type IN ('course_completion', 'skill_mastery', 'project_submission', 'streak', 'community', 'special')),
  criteria JSONB NOT NULL, -- { "course_id": "xxx" } or { "skill_id": "xxx", "level": "advanced" }
  points INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  
  -- Visibility
  is_active BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE, -- Hidden until earned
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress JSONB DEFAULT '{}', -- Track progress toward achievement
  
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- 5. SKILL ENDORSEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- User being endorsed
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- User giving endorsement
  
  -- Endorsement details
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  comment TEXT,
  relationship TEXT CHECK (relationship IN ('instructor', 'mentor', 'peer', 'employer')),
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id, endorser_id)
);

-- ============================================
-- 6. USER SKILLS TABLE (Enhanced Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Proficiency tracking
  current_level TEXT NOT NULL DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  target_level TEXT CHECK (target_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Progress metrics
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  courses_completed INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  assessments_passed INTEGER DEFAULT 0,
  
  -- Time tracking
  time_spent_minutes INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  mastered_at TIMESTAMPTZ,
  
  -- Source
  acquired_from TEXT CHECK (acquired_from IN ('course', 'project', 'assessment', 'self_reported')),
  source_id TEXT, -- Course ID or project ID
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_status ON portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_visibility ON portfolio_projects(visibility);
CREATE INDEX IF NOT EXISTS idx_portfolio_artifacts_project ON portfolio_artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_user ON skill_endorsements(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_skill ON skill_endorsements(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_level ON user_skills(current_level);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_portfolio_projects_updated_at 
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at 
  BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Portfolio Projects
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects viewable by everyone" ON portfolio_projects
  FOR SELECT USING (visibility = 'public' OR status = 'published');

CREATE POLICY "Users can view own projects" ON portfolio_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON portfolio_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON portfolio_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON portfolio_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Portfolio Artifacts
ALTER TABLE portfolio_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artifacts viewable if project is viewable" ON portfolio_artifacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolio_projects 
      WHERE portfolio_projects.id = portfolio_artifacts.project_id
      AND (portfolio_projects.user_id = auth.uid() OR portfolio_projects.visibility = 'public')
    )
  );

CREATE POLICY "Users can manage own project artifacts" ON portfolio_artifacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM portfolio_projects 
      WHERE portfolio_projects.id = portfolio_artifacts.project_id
      AND portfolio_projects.user_id = auth.uid()
    )
  );

-- Achievements (Public Read)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements viewable by everyone" ON achievements
  FOR SELECT USING (is_active = TRUE);

-- User Achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public achievements viewable by everyone" ON user_achievements
  FOR SELECT USING (TRUE); -- Allow viewing others' achievements

-- Skill Endorsements
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view endorsements for any user" ON skill_endorsements
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create endorsements" ON skill_endorsements
  FOR INSERT WITH CHECK (auth.uid() = endorser_id);

-- User Skills
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public skills viewable" ON user_skills
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- SEED SOME DEFAULT ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (name, slug, description, type, criteria, icon, rarity) VALUES
  ('First Steps', 'first-steps', 'Complete your first lesson', 'course_completion', '{"lessons_completed": 1}', 'Footprints', 'common'),
  ('Course Completion', 'course-completion', 'Complete your first course', 'course_completion', '{"courses_completed": 1}', 'Award', 'uncommon'),
  ('Portfolio Builder', 'portfolio-builder', 'Add your first project to portfolio', 'project_submission', '{"projects_submitted": 1}', 'Briefcase', 'uncommon'),
  ('Skill Master', 'skill-master', 'Master your first skill', 'skill_mastery', '{"skills_mastered": 1}', 'Target', 'rare'),
  ('Dedicated Learner', 'dedicated-learner', 'Maintain a 7-day learning streak', 'streak', '{"streak_days": 7}', 'Flame', 'rare'),
  ('Knowledge Sharer', 'knowledge-sharer', 'Help 5 peers in discussions', 'community', '{"helpful_replies": 5}', 'Users', 'uncommon')
ON CONFLICT (slug) DO NOTHING;

-- Verification
SELECT 'Phase 1 Completion Tables Created!' as status;
SELECT 
  'Portfolio Projects' as table_name, 
  COUNT(*) as row_count 
FROM portfolio_projects
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'User Skills', COUNT(*) FROM user_skills;
