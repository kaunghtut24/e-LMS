-- Fix Missing Tables
-- Run this to create the 7 tables that didn't get created

-- ============================================
-- MISSING FROM PHASE 1
-- ============================================

-- 1. SKILL ENDORSEMENTS TABLE
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  comment TEXT,
  relationship TEXT CHECK (relationship IN ('instructor', 'mentor', 'peer', 'employer')),
  
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id, endorser_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_endorsements_user ON skill_endorsements(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_skill ON skill_endorsements(skill_id);

ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view endorsements for any user" ON skill_endorsements
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create endorsements" ON skill_endorsements
  FOR INSERT WITH CHECK (auth.uid() = endorser_id);

-- 2. USER SKILLS TABLE
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  current_level TEXT NOT NULL DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  target_level TEXT CHECK (target_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  courses_completed INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  assessments_passed INTEGER DEFAULT 0,
  
  time_spent_minutes INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  mastered_at TIMESTAMPTZ,
  
  acquired_from TEXT CHECK (acquired_from IN ('course', 'project', 'assessment', 'self_reported')),
  source_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_level ON user_skills(current_level);

CREATE TRIGGER update_user_skills_updated_at 
  BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public skills viewable" ON user_skills
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- MISSING FROM PHASE 2
-- ============================================

-- 3. PRE-ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS pre_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  questions JSONB NOT NULL,
  time_limit_minutes INTEGER,
  passing_score INTEGER DEFAULT 70,
  
  skills_assessed TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_pre_assessments_updated_at 
  BEFORE UPDATE ON pre_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE pre_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active assessments viewable by everyone" ON pre_assessments
  FOR SELECT USING (is_active = TRUE);

-- 4. PRE-ASSESSMENT RESULTS TABLE
CREATE TABLE IF NOT EXISTS pre_assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES pre_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  
  answers JSONB NOT NULL,
  time_taken_minutes INTEGER,
  
  skill_scores JSONB DEFAULT '{}',
  identified_gaps TEXT[],
  
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pre_assessment_results_user ON pre_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_pre_assessment_results_assessment ON pre_assessment_results(assessment_id);

ALTER TABLE pre_assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment results" ON pre_assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessment results" ON pre_assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. SKILL GAPS TABLE
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  current_level TEXT CHECK (current_level IN ('none', 'beginner', 'intermediate', 'advanced', 'expert')),
  target_level TEXT NOT NULL CHECK (target_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  gap_size TEXT NOT NULL CHECK (gap_size IN ('small', 'medium', 'large')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  recommended_courses TEXT[],
  recommended_resources JSONB DEFAULT '[]',
  estimated_time_to_close_hours INTEGER,
  
  status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'in_progress', 'closed', 'obsolete')),
  identified_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  
  identified_by TEXT CHECK (identified_by IN ('pre_assessment', 'course_performance', 'self_reported', 'employer_requirement', 'system_analysis')),
  source_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_priority ON skill_gaps(priority);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_status ON skill_gaps(status);

CREATE TRIGGER update_skill_gaps_updated_at 
  BEFORE UPDATE ON skill_gaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill gaps" ON skill_gaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create skill gaps" ON skill_gaps
  FOR INSERT WITH CHECK (TRUE);

-- 6. COURSE PREREQUISITES TABLE
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  
  is_required BOOLEAN DEFAULT TRUE,
  minimum_skill_level TEXT CHECK (minimum_skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  alternative_prerequisites TEXT[],
  
  CHECK (
    (prerequisite_course_id IS NOT NULL AND prerequisite_skill_id IS NULL) OR
    (prerequisite_course_id IS NULL AND prerequisite_skill_id IS NOT NULL)
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_prerequisites_course ON course_prerequisites(course_id);

ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prerequisites viewable by everyone" ON course_prerequisites
  FOR SELECT USING (TRUE);

-- 7. RECOMMENDATION LOGS TABLE
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('course', 'learning_path', 'skill', 'content')),
  recommended_item_id TEXT NOT NULL,
  recommended_item_type TEXT NOT NULL,
  
  context JSONB DEFAULT '{}',
  algorithm_version TEXT,
  confidence_score NUMERIC(3,2),
  
  shown_to_user BOOLEAN DEFAULT TRUE,
  user_clicked BOOLEAN DEFAULT FALSE,
  user_enrolled BOOLEAN DEFAULT FALSE,
  user_completed BOOLEAN DEFAULT FALSE,
  user_feedback TEXT CHECK (user_feedback IN ('helpful', 'not_helpful', 'irrelevant')),
  
  recommended_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_recommendation_logs_user ON recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_type ON recommendation_logs(recommendation_type);

ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON recommendation_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION calculate_gap_size(current_lvl TEXT, target_lvl TEXT)
RETURNS TEXT AS $$
DECLARE
  level_map JSONB := '{"none": 0, "beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}';
  current_val INTEGER;
  target_val INTEGER;
  gap INTEGER;
BEGIN
  current_val := (level_map->>current_lvl)::INTEGER;
  target_val := (level_map->>target_lvl)::INTEGER;
  gap := target_val - current_val;
  
  IF gap <= 1 THEN
    RETURN 'small';
  ELSIF gap <= 2 THEN
    RETURN 'medium';
  ELSE
    RETURN 'large';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'All 7 Missing Tables Created!' as status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'skill_endorsements',
    'user_skills',
    'pre_assessments',
    'pre_assessment_results',
    'skill_gaps',
    'course_prerequisites',
    'recommendation_logs'
  )
ORDER BY table_name;
