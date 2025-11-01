-- Quick verification queries
-- Run these in Supabase SQL Editor to check if data exists

-- Check categories
SELECT 
  name, 
  slug, 
  icon, 
  is_active 
FROM categories 
ORDER BY order_index;

-- Check skills
SELECT 
  name, 
  slug, 
  level, 
  market_demand 
FROM skills 
ORDER BY market_demand DESC;

-- Count all data
SELECT 
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM skills) as total_skills,
  (SELECT COUNT(*) FROM courses) as total_courses,
  (SELECT COUNT(*) FROM profiles) as total_profiles;
