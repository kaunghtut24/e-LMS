-- ============================================
-- Phase 3: Assessment & Evaluation System
-- ============================================
-- This script adds the complete assessment system
-- including quizzes, assignments, grading, and rubrics

-- 1. ASSESSMENTS TABLE
-- Stores quiz/exam information
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('quiz', 'exam', 'assignment', 'project', 'survey')),
    instructions TEXT,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 1,
    passing_score DECIMAL(5,2),
    shuffle_questions BOOLEAN DEFAULT false,
    show_correct_answers BOOLEAN DEFAULT true,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    randomize_answers BOOLEAN DEFAULT false,
    total_points DECIMAL(10,2) DEFAULT 0,
    weight DECIMAL(5,2) DEFAULT 100.00,
    is_published BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ASSESSMENT QUESTIONS TABLE
-- Stores individual questions for assessments
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank', 'matching', 'code')),
    question_text TEXT NOT NULL,
    question_data JSONB NOT NULL, -- stores options, correct answers, etc.
    points DECIMAL(10,2) NOT NULL DEFAULT 1,
    explanation TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    tags TEXT[],
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSESSMENT ATTEMPTS TABLE
-- Tracks student attempts at assessments
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    score DECIMAL(10,2),
    total_possible DECIMAL(10,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    UNIQUE(assessment_id, user_id, attempt_number)
);

-- 4. ASSESSMENT RESPONSES TABLE
-- Stores student answers to questions
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE NOT NULL,
    answer_text TEXT,
    answer_data JSONB,
    is_correct BOOLEAN,
    points_earned DECIMAL(10,2) DEFAULT 0,
    auto_graded BOOLEAN DEFAULT true,
    graded_at TIMESTAMPTZ,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- 5. RUBRICS TABLE
-- Defines grading criteria for assessments
CREATE TABLE IF NOT EXISTS rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_points DECIMAL(10,2) NOT NULL,
    criteria JSONB NOT NULL, -- Array of criteria with levels
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RUBRIC ASSESSMENTS TABLE
-- Stores rubric-based evaluations
CREATE TABLE IF NOT EXISTS rubric_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE NOT NULL,
    rubric_id UUID REFERENCES rubrics(id) ON DELETE CASCADE NOT NULL,
    evaluator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scores JSONB NOT NULL, -- Scores for each criterion
    total_score DECIMAL(10,2),
    max_score DECIMAL(10,2),
    percentage DECIMAL(5,2),
    overall_feedback TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, rubric_id)
);

-- 7. ASSESSMENT ANALYTICS TABLE
-- Stores analytics data for assessments
CREATE TABLE IF NOT EXISTS assessment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    median_score DECIMAL(5,2),
    highest_score DECIMAL(5,2),
    lowest_score DECIMAL(5,2),
    pass_rate DECIMAL(5,2),
    average_time_minutes DECIMAL(8,2),
    question_stats JSONB, -- Stats per question
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(type);
CREATE INDEX IF NOT EXISTS idx_assessments_published ON assessments(is_published);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_type ON assessment_questions(question_type);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment_id ON assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_question_id ON assessment_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_rubrics_assessment_id ON rubrics(assessment_id);

CREATE INDEX IF NOT EXISTS idx_rubric_assessments_attempt_id ON rubric_assessments(attempt_id);
CREATE INDEX IF NOT EXISTS idx_rubric_assessments_rubric_id ON rubric_assessments(rubric_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_analytics ENABLE ROW LEVEL SECURITY;

-- Assessments policies
CREATE POLICY "Users can view published assessments for their courses" ON assessments
    FOR SELECT USING (
        is_published = true
        AND course_id IN (
            SELECT course_id FROM enrollments WHERE user_id = auth.uid()
            UNION
            SELECT id FROM courses WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage their course assessments" ON assessments
    FOR ALL USING (
        course_id IN (
            SELECT id FROM courses WHERE created_by = auth.uid()
        )
    );

-- Assessment questions policies
CREATE POLICY "Users can view questions for accessible assessments" ON assessment_questions
    FOR SELECT USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE is_published = true
            AND course_id IN (
                SELECT course_id FROM enrollments WHERE user_id = auth.uid()
                UNION
                SELECT id FROM courses WHERE created_by = auth.uid()
            )
        )
    );

CREATE POLICY "Instructors can manage questions for their assessments" ON assessment_questions
    FOR ALL USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE course_id IN (
                SELECT id FROM courses WHERE created_by = auth.uid()
            )
        )
    );

-- Assessment attempts policies
CREATE POLICY "Users can view their own attempts" ON assessment_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create attempts for themselves" ON assessment_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own in-progress attempts" ON assessment_attempts
    FOR UPDATE USING (user_id = auth.uid() AND status = 'in_progress');

CREATE POLICY "Instructors can view attempts for their course assessments" ON assessment_attempts
    FOR SELECT USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE course_id IN (
                SELECT id FROM courses WHERE created_by = auth.uid()
            )
        )
    );

-- Assessment responses policies
CREATE POLICY "Users can manage responses for their attempts" ON assessment_responses
    FOR ALL USING (
        attempt_id IN (
            SELECT id FROM assessment_attempts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can view responses for their course attempts" ON assessment_responses
    FOR SELECT USING (
        attempt_id IN (
            SELECT id FROM assessment_attempts WHERE assessment_id IN (
                SELECT id FROM assessments WHERE course_id IN (
                    SELECT id FROM courses WHERE created_by = auth.uid()
                )
            )
        )
    );

-- Rubrics policies
CREATE POLICY "Users can view rubrics for accessible assessments" ON rubrics
    FOR SELECT USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE is_published = true
            AND course_id IN (
                SELECT course_id FROM enrollments WHERE user_id = auth.uid()
                UNION
                SELECT id FROM courses WHERE created_by = auth.uid()
            )
        )
    );

CREATE POLICY "Instructors can manage rubrics for their assessments" ON rubrics
    FOR ALL USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE course_id IN (
                SELECT id FROM courses WHERE created_by = auth.uid()
            )
        )
    );

-- Rubric assessments policies
CREATE POLICY "Users can view their own rubric assessments" ON rubric_assessments
    FOR SELECT USING (
        attempt_id IN (
            SELECT id FROM assessment_attempts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage rubric assessments for their courses" ON rubric_assessments
    FOR ALL USING (
        attempt_id IN (
            SELECT id FROM assessment_attempts WHERE assessment_id IN (
                SELECT id FROM assessments WHERE course_id IN (
                    SELECT id FROM courses WHERE created_by = auth.uid()
                )
            )
        )
    );

-- Assessment analytics policies
CREATE POLICY "Users can view analytics for their course assessments" ON assessment_analytics
    FOR SELECT USING (
        assessment_id IN (
            SELECT id FROM assessments WHERE course_id IN (
                SELECT id FROM courses WHERE created_by = auth.uid()
                UNION
                SELECT course_id FROM enrollments WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rubrics_updated_at BEFORE UPDATE ON rubrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate assessment totals
CREATE OR REPLACE FUNCTION calculate_assessment_total_points()
RETURNS TRIGGER AS $$
DECLARE
    total_points DECIMAL(10,2);
BEGIN
    -- Calculate total points for the assessment
    SELECT COALESCE(SUM(points), 0) INTO total_points
    FROM assessment_questions
    WHERE assessment_id = NEW.assessment_id;

    -- Update the assessment total_points
    UPDATE assessments
    SET total_points = total_points,
        updated_at = NOW()
    WHERE id = NEW.assessment_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update total points when questions are added/updated
CREATE TRIGGER trigger_calculate_assessment_total
    AFTER INSERT OR UPDATE OR DELETE ON assessment_questions
    FOR EACH ROW EXECUTE FUNCTION calculate_assessment_total_points();

-- Function to update analytics after attempt is submitted
CREATE OR REPLACE FUNCTION update_assessment_analytics()
RETURNS TRIGGER AS $$
DECLARE
    avg_score DECIMAL(5,2);
    med_score DECIMAL(5,2);
    high_score DECIMAL(5,2);
    low_score DECIMAL(5,2);
    pass_rate DECIMAL(5,2);
    avg_time DECIMAL(8,2);
    total_attempts INTEGER;
BEGIN
    -- Only update when attempt is submitted or graded
    IF NEW.status IN ('submitted', 'graded') AND OLD.status != NEW.status THEN
        -- Calculate statistics
        SELECT
            AVG(percentage),
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY percentage),
            MAX(percentage),
            MIN(percentage),
            (COUNT(*) FILTER WHERE passed = true) * 100.0 / COUNT(*),
            AVG(time_spent_seconds / 60.0),
            COUNT(*)
        INTO avg_score, med_score, high_score, low_score, pass_rate, avg_time, total_attempts
        FROM assessment_attempts
        WHERE assessment_id = NEW.assessment_id
        AND status IN ('submitted', 'graded');

        -- Insert or update analytics
        INSERT INTO assessment_analytics (
            assessment_id, total_attempts, average_score, median_score,
            highest_score, lowest_score, pass_rate, average_time_minutes,
            created_at, updated_at
        ) VALUES (
            NEW.assessment_id, total_attempts, avg_score, med_score,
            high_score, low_score, pass_rate, avg_time,
            NOW(), NOW()
        )
        ON CONFLICT (assessment_id) DO UPDATE SET
            total_attempts = EXCLUDED.total_attempts,
            average_score = EXCLUDED.average_score,
            median_score = EXCLUDED.median_score,
            highest_score = EXCLUDED.highest_score,
            lowest_score = EXCLUDED.lowest_score,
            pass_rate = EXCLUDED.pass_rate,
            average_time_minutes = EXCLUDED.average_time_minutes,
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update analytics
CREATE TRIGGER trigger_update_assessment_analytics
    AFTER UPDATE ON assessment_attempts
    FOR EACH ROW EXECUTE FUNCTION update_assessment_analytics();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample rubric criteria
INSERT INTO rubrics (id, title, description, total_points, criteria, created_by)
VALUES (
    gen_random_uuid(),
    'Programming Project Rubric',
    'Standard rubric for coding projects',
    100.00,
    '[
        {
            "name": "Code Quality",
            "description": "Clean, readable, well-structured code",
            "levels": [
                {"name": "Excellent", "points": 25, "description": "Highly readable, follows best practices"},
                {"name": "Good", "points": 20, "description": "Readable with minor issues"},
                {"name": "Satisfactory", "points": 15, "description": "Understandable but could be improved"},
                {"name": "Needs Improvement", "points": 10, "description": "Difficult to read"}
            ]
        },
        {
            "name": "Functionality",
            "description": "All features work as expected",
            "levels": [
                {"name": "Excellent", "points": 30, "description": "All features work perfectly"},
                {"name": "Good", "points": 24, "description": "Most features work with minor bugs"},
                {"name": "Satisfactory", "points": 18, "description": "Core features work"},
                {"name": "Needs Improvement", "points": 12, "description": "Major functionality missing"}
            ]
        },
        {
            "name": "Documentation",
            "description": "Code comments and README",
            "levels": [
                {"name": "Excellent", "points": 20, "description": "Comprehensive documentation"},
                {"name": "Good", "points": 16, "description": "Good documentation with minor gaps"},
                {"name": "Satisfactory", "points": 12, "description": "Basic documentation present"},
                {"name": "Needs Improvement", "points": 8, "description": "Minimal documentation"}
            ]
        },
        {
            "name": "Testing",
            "description": "Test coverage and quality",
            "levels": [
                {"name": "Excellent", "points": 25, "description": "Comprehensive test suite"},
                {"name": "Good", "points": 20, "description": "Good test coverage"},
                {"name": "Satisfactory", "points": 15, "description": "Basic tests present"},
                {"name": "Needs Improvement", "points": 10, "description": "No tests or very few"}
            ]
        }
    ]'::jsonb,
    (SELECT id FROM profiles WHERE role = 'instructor' LIMIT 1)
);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
SELECT 'Assessment System Tables Created' as status,
       COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'assessments',
    'assessment_questions',
    'assessment_attempts',
    'assessment_responses',
    'rubrics',
    'rubric_assessments',
    'assessment_analytics'
);

-- Verify policies created
SELECT 'RLS Policies Created' as status,
       COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
    'assessments',
    'assessment_questions',
    'assessment_attempts',
    'assessment_responses',
    'rubrics',
    'rubric_assessments',
    'assessment_analytics'
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Phase 3 Assessment & Evaluation System Successfully Created!';
    RAISE NOTICE '📊 Created 7 new tables with full functionality';
    RAISE NOTICE '🔒 RLS policies enabled on all tables';
    RAISE NOTICE '⚡ Indexes created for optimal performance';
    RAISE NOTICE '🔔 Triggers added for automation';
    RAISE NOTICE '📝 Sample rubric inserted';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Build UI components for assessments';
END $$;
