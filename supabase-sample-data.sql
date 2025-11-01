-- Sample Data for e-LMS
-- Run this AFTER creating the schema

-- ============================================
-- 1. CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, icon, order_index, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Web Development', 'web-development', 'Learn modern web development technologies', 'Code', 1, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Programming', 'programming', 'Master programming languages and concepts', 'Terminal', 2, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Data Science', 'data-science', 'Explore data analysis and machine learning', 'BarChart3', 3, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Design', 'design', 'UI/UX design and graphic design courses', 'Palette', 4, true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Business', 'business', 'Business and entrepreneurship skills', 'Briefcase', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. SKILLS
-- ============================================
INSERT INTO skills (id, name, slug, category_id, level, market_demand) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'React', 'react', '550e8400-e29b-41d4-a716-446655440001', 'intermediate', 95),
  ('660e8400-e29b-41d4-a716-446655440002', 'TypeScript', 'typescript', '550e8400-e29b-41d4-a716-446655440001', 'intermediate', 90),
  ('660e8400-e29b-41d4-a716-446655440003', 'Node.js', 'nodejs', '550e8400-e29b-41d4-a716-446655440001', 'intermediate', 88),
  ('660e8400-e29b-41d4-a716-446655440004', 'Python', 'python', '550e8400-e29b-41d4-a716-446655440002', 'beginner', 92),
  ('660e8400-e29b-41d4-a716-446655440005', 'Machine Learning', 'machine-learning', '550e8400-e29b-41d4-a716-446655440003', 'advanced', 85)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NOTE: Sample courses will be added AFTER you register your first user
-- The instructor_id must reference a real user from auth.users
-- ============================================

-- You can add sample courses manually after registering by running:
-- 
-- INSERT INTO courses (
--   title, slug, description, instructor_id, category_id, 
--   level, price, currency, duration_hours, status, is_featured
-- ) VALUES (
--   'Complete React & TypeScript Course',
--   'complete-react-typescript',
--   'Master React and TypeScript from beginner to advanced',
--   'YOUR_USER_ID_HERE',  -- Replace with actual user ID after registration
--   '550e8400-e29b-41d4-a716-446655440001',
--   'intermediate',
--   89.99,
--   'USD',
--   24.5,
--   'published',
--   true
-- );

COMMENT ON TABLE categories IS 'Sample categories added. Ready to use!';
COMMENT ON TABLE skills IS 'Sample skills added. Ready to use!';
