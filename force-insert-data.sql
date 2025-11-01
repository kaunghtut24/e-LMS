-- Force insert sample data (removes conflicts)
-- Use this if sample data didn't insert

-- Clear existing sample data first (optional)
-- DELETE FROM skills;
-- DELETE FROM categories;

-- Insert categories
INSERT INTO categories (name, slug, description, icon, order_index, is_active) 
VALUES
  ('Web Development', 'web-development', 'Learn modern web development technologies', 'Code', 1, true),
  ('Programming', 'programming', 'Master programming languages and concepts', 'Terminal', 2, true),
  ('Data Science', 'data-science', 'Explore data analysis and machine learning', 'BarChart3', 3, true),
  ('Design', 'design', 'UI/UX design and graphic design courses', 'Palette', 4, true),
  ('Business', 'business', 'Business and entrepreneurship skills', 'Briefcase', 5, true)
RETURNING name, slug;

-- Insert skills
INSERT INTO skills (name, slug, level, market_demand) 
VALUES
  ('React', 'react', 'intermediate', 95),
  ('TypeScript', 'typescript', 'intermediate', 90),
  ('Node.js', 'nodejs', 'intermediate', 88),
  ('Python', 'python', 'beginner', 92),
  ('Machine Learning', 'machine-learning', 'advanced', 85)
RETURNING name, slug, level;
