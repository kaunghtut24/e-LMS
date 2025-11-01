-- Test Phase 1 & Phase 2 Database
-- Run this to verify everything works and add sample data

-- ============================================
-- TEST 1: Verify All Tables Exist
-- ============================================
SELECT 'Testing all 13 tables exist...' as test;

SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'portfolio_projects', 'portfolio_artifacts',
    'achievements', 'user_achievements',
    'skill_endorsements', 'user_skills',
    'pre_assessments', 'pre_assessment_results',
    'learning_paths', 'user_learning_paths',
    'skill_gaps', 'course_prerequisites',
    'recommendation_logs'
  );
-- Should return: 13

-- ============================================
-- TEST 2: Check Default Achievements
-- ============================================
SELECT 'Checking achievements...' as test;

SELECT name, type, rarity, points 
FROM achievements 
ORDER BY rarity DESC, name;

-- ============================================
-- TEST 3: Insert Sample Portfolio Project
-- ============================================
SELECT 'Creating sample portfolio project...' as test;

INSERT INTO portfolio_projects (
  user_id,
  title,
  description,
  skills,
  status,
  visibility,
  project_type
)
SELECT 
  id as user_id,
  'E-Commerce Website' as title,
  'Full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include product catalog, shopping cart, checkout, and admin dashboard.' as description,
  ARRAY['react', 'nodejs', 'postgresql', 'typescript', 'tailwindcss'] as skills,
  'published' as status,
  'public' as visibility,
  'personal' as project_type
FROM profiles 
WHERE role IN ('learner', 'admin')
LIMIT 1
ON CONFLICT DO NOTHING
RETURNING id, title, status;

-- ============================================
-- TEST 4: Add Artifacts to Portfolio Project
-- ============================================
SELECT 'Adding portfolio artifacts...' as test;

INSERT INTO portfolio_artifacts (
  project_id,
  type,
  title,
  description,
  url,
  order_index
)
SELECT 
  pp.id as project_id,
  'image' as type,
  'Homepage Screenshot' as title,
  'Landing page with featured products' as description,
  'https://placehold.co/800x600/png' as url,
  1 as order_index
FROM portfolio_projects pp
WHERE pp.title = 'E-Commerce Website'
LIMIT 1
ON CONFLICT DO NOTHING
RETURNING title, type;

-- ============================================
-- TEST 5: Create Sample Learning Path
-- ============================================
SELECT 'Creating sample learning path...' as test;

INSERT INTO learning_paths (
  title,
  description,
  target_role,
  target_skills,
  difficulty_level,
  estimated_duration_hours,
  path_structure,
  is_template,
  is_active
)
VALUES (
  'Full-Stack Web Developer',
  'Complete path to becoming a full-stack web developer. Learn frontend, backend, and database technologies.',
  'Full-Stack Developer',
  ARRAY['react', 'nodejs', 'postgresql', 'typescript', 'api-design'],
  'intermediate',
  120,
  '[
    {"id": "1", "type": "course", "item_id": "intro-html-css", "title": "HTML & CSS Fundamentals", "order": 1, "is_required": true, "estimated_duration_hours": 20, "skills_covered": ["html", "css"]},
    {"id": "2", "type": "course", "item_id": "javascript-basics", "title": "JavaScript Essentials", "order": 2, "is_required": true, "estimated_duration_hours": 30, "skills_covered": ["javascript"]},
    {"id": "3", "type": "course", "item_id": "react-fundamentals", "title": "React Fundamentals", "order": 3, "is_required": true, "estimated_duration_hours": 25, "skills_covered": ["react"]},
    {"id": "4", "type": "course", "item_id": "nodejs-backend", "title": "Node.js Backend Development", "order": 4, "is_required": true, "estimated_duration_hours": 25, "skills_covered": ["nodejs", "express"]},
    {"id": "5", "type": "course", "item_id": "database-design", "title": "Database Design with PostgreSQL", "order": 5, "is_required": true, "estimated_duration_hours": 20, "skills_covered": ["postgresql", "sql"]}
  ]'::jsonb,
  true,
  true
)
ON CONFLICT DO NOTHING
RETURNING id, title, difficulty_level;

-- ============================================
-- TEST 6: Create Sample Pre-Assessment
-- ============================================
SELECT 'Creating sample pre-assessment...' as test;

INSERT INTO pre_assessments (
  title,
  description,
  questions,
  time_limit_minutes,
  passing_score,
  skills_assessed,
  difficulty_level,
  is_active
)
VALUES (
  'JavaScript Fundamentals Assessment',
  'Test your knowledge of JavaScript basics including variables, functions, arrays, and objects.',
  '[
    {
      "id": "q1",
      "question": "What is the difference between let and var?",
      "type": "multiple_choice",
      "options": ["Block scope vs function scope", "No difference", "let is faster", "var is deprecated"],
      "correct_answer": 0,
      "points": 10,
      "skill_id": "javascript"
    },
    {
      "id": "q2",
      "question": "What does Array.map() return?",
      "type": "multiple_choice",
      "options": ["Nothing", "The original array", "A new transformed array", "A boolean"],
      "correct_answer": 2,
      "points": 10,
      "skill_id": "javascript"
    },
    {
      "id": "q3",
      "question": "What is a closure in JavaScript?",
      "type": "text",
      "correct_answer": "A function that has access to variables in its outer scope",
      "points": 15,
      "skill_id": "javascript"
    }
  ]'::jsonb,
  30,
  70,
  ARRAY['javascript', 'programming-fundamentals'],
  'beginner',
  true
)
ON CONFLICT DO NOTHING
RETURNING id, title, passing_score;

-- ============================================
-- TEST 7: Add User Skills
-- ============================================
SELECT 'Adding user skills...' as test;

INSERT INTO user_skills (
  user_id,
  skill_id,
  current_level,
  target_level,
  progress_percentage,
  courses_completed,
  acquired_from
)
SELECT 
  p.id as user_id,
  s.id as skill_id,
  'intermediate' as current_level,
  'expert' as target_level,
  60 as progress_percentage,
  2 as courses_completed,
  'course' as acquired_from
FROM profiles p
CROSS JOIN skills s
WHERE p.role IN ('learner', 'admin')
  AND s.name IN ('React', 'TypeScript', 'JavaScript')
LIMIT 3
ON CONFLICT (user_id, skill_id) DO NOTHING
RETURNING id, current_level;

-- ============================================
-- TEST 8: Create Sample Skill Gap
-- ============================================
SELECT 'Creating sample skill gap...' as test;

INSERT INTO skill_gaps (
  user_id,
  skill_id,
  current_level,
  target_level,
  gap_size,
  priority,
  status,
  identified_by
)
SELECT 
  p.id as user_id,
  s.id as skill_id,
  'beginner' as current_level,
  'advanced' as target_level,
  'large' as gap_size,
  'high' as priority,
  'identified' as status,
  'self_reported' as identified_by
FROM profiles p
CROSS JOIN skills s
WHERE p.role IN ('learner', 'admin')
  AND s.name = 'Node.js'
LIMIT 1
ON CONFLICT (user_id, skill_id) DO NOTHING
RETURNING id, gap_size, priority;

-- ============================================
-- FINAL VERIFICATION
-- ============================================
SELECT '=== TEST RESULTS ===' as summary;

SELECT 
  'Portfolio Projects' as table_name,
  COUNT(*) as row_count
FROM portfolio_projects
UNION ALL
SELECT 'Portfolio Artifacts', COUNT(*) FROM portfolio_artifacts
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'User Skills', COUNT(*) FROM user_skills
UNION ALL
SELECT 'Learning Paths', COUNT(*) FROM learning_paths
UNION ALL
SELECT 'Skill Gaps', COUNT(*) FROM skill_gaps
UNION ALL
SELECT 'Pre-Assessments', COUNT(*) FROM pre_assessments;

SELECT '✅ Database is ready!' as status;
