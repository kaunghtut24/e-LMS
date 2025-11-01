-- Phase 2 Foundation: Adaptive Learning Path Engine
-- Run this AFTER phase1-completion.sql

-- ============================================
-- 1. PRE-ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pre_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Assessment configuration
  questions JSONB NOT NULL, -- Array of questions
  time_limit_minutes INTEGER,
  passing_score INTEGER DEFAULT 70,
  
  -- Skill mapping
  skills_assessed TEXT[], -- Array of skill IDs
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRE-ASSESSMENT RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pre_assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES pre_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Results
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  
  -- Detailed results
  answers JSONB NOT NULL, -- User's answers
  time_taken_minutes INTEGER,
  
  -- Skill analysis
  skill_scores JSONB DEFAULT '{}', -- { "skill_id": score }
  identified_gaps TEXT[], -- Array of skill IDs where user scored low
  
  -- Timestamps
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(assessment_id, user_id, created_at) -- Allow retakes
);

-- ============================================
-- 3. LEARNING PATHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Path configuration
  target_role TEXT, -- e.g., "Frontend Developer", "Data Scientist"
  target_skills TEXT[] NOT NULL, -- Array of skill IDs
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_duration_hours INTEGER,
  
  -- Prerequisites
  required_skills TEXT[], -- Skills needed to start
  
  -- Path structure
  path_structure JSONB NOT NULL, -- Ordered sequence of courses/modules
  
  -- Metadata
  is_template BOOLEAN DEFAULT TRUE, -- Template vs personalized
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. USER LEARNING PATHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  
  -- Customization
  custom_title TEXT,
  custom_structure JSONB, -- Personalized modifications
  
  -- Progress
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  progress_percentage INTEGER DEFAULT 0,
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  
  -- Tracking
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_completion_date DATE,
  
  -- Analytics
  time_spent_minutes INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  skills_acquired TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, learning_path_id)
);

-- ============================================
-- 5. SKILL GAPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Gap analysis
  current_level TEXT CHECK (current_level IN ('none', 'beginner', 'intermediate', 'advanced', 'expert')),
  target_level TEXT NOT NULL CHECK (target_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  gap_size TEXT NOT NULL CHECK (gap_size IN ('small', 'medium', 'large')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Recommendations
  recommended_courses TEXT[], -- Array of course IDs
  recommended_resources JSONB DEFAULT '[]', -- External resources
  estimated_time_to_close_hours INTEGER,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'in_progress', 'closed', 'obsolete')),
  identified_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  
  -- Source
  identified_by TEXT CHECK (identified_by IN ('pre_assessment', 'course_performance', 'self_reported', 'employer_requirement', 'system_analysis')),
  source_id TEXT, -- Reference to assessment or analysis
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

-- ============================================
-- 6. COURSE PREREQUISITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Requirement details
  is_required BOOLEAN DEFAULT TRUE,
  minimum_skill_level TEXT CHECK (minimum_skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  alternative_prerequisites TEXT[], -- Alternative course/skill IDs
  
  -- Validation
  CHECK (
    (prerequisite_course_id IS NOT NULL AND prerequisite_skill_id IS NULL) OR
    (prerequisite_course_id IS NULL AND prerequisite_skill_id IS NOT NULL)
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. RECOMMENDATION LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Recommendation
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('course', 'learning_path', 'skill', 'content')),
  recommended_item_id TEXT NOT NULL,
  recommended_item_type TEXT NOT NULL,
  
  -- Context
  context JSONB DEFAULT '{}', -- Why this was recommended
  algorithm_version TEXT,
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  
  -- User interaction
  shown_to_user BOOLEAN DEFAULT TRUE,
  user_clicked BOOLEAN DEFAULT FALSE,
  user_enrolled BOOLEAN DEFAULT FALSE,
  user_completed BOOLEAN DEFAULT FALSE,
  user_feedback TEXT CHECK (user_feedback IN ('helpful', 'not_helpful', 'irrelevant')),
  
  -- Timestamps
  recommended_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pre_assessment_results_user ON pre_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_pre_assessment_results_assessment ON pre_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_active ON learning_paths(is_active);
CREATE INDEX IF NOT EXISTS idx_user_learning_paths_user ON user_learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_paths_status ON user_learning_paths(status);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_priority ON skill_gaps(priority);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_status ON skill_gaps(status);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_course ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_user ON recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_type ON recommendation_logs(recommendation_type);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_pre_assessments_updated_at 
  BEFORE UPDATE ON pre_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at 
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_paths_updated_at 
  BEFORE UPDATE ON user_learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_gaps_updated_at 
  BEFORE UPDATE ON skill_gaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Pre-Assessments (Public Read)
ALTER TABLE pre_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active assessments viewable by everyone" ON pre_assessments
  FOR SELECT USING (is_active = TRUE);

-- Pre-Assessment Results (Private)
ALTER TABLE pre_assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessment results" ON pre_assessment_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assessment results" ON pre_assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning Paths (Public Read)
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active learning paths viewable by everyone" ON learning_paths
  FOR SELECT USING (is_active = TRUE);

-- User Learning Paths (Private)
ALTER TABLE user_learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own learning paths" ON user_learning_paths
  FOR ALL USING (auth.uid() = user_id);

-- Skill Gaps (Private)
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own skill gaps" ON skill_gaps
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create skill gaps" ON skill_gaps
  FOR INSERT WITH CHECK (TRUE); -- System-generated

-- Course Prerequisites (Public Read)
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prerequisites viewable by everyone" ON course_prerequisites
  FOR SELECT USING (TRUE);

-- Recommendation Logs (Private)
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recommendations" ON recommendation_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR SKILL GAP ANALYSIS
-- ============================================

-- Function to calculate skill gap size
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

-- Verification
SELECT 'Phase 2 Foundation Tables Created!' as status;
SELECT 
  'Pre-Assessments' as table_name, 
  COUNT(*) as row_count 
FROM pre_assessments
UNION ALL
SELECT 'Learning Paths', COUNT(*) FROM learning_paths
UNION ALL
SELECT 'Skill Gaps', COUNT(*) FROM skill_gaps;
