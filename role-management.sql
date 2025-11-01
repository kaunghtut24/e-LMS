-- Role Management Queries for Supabase

-- ============================================
-- VIEW ALL USERS AND THEIR ROLES
-- ============================================
SELECT 
  id,
  email,
  first_name || ' ' || last_name as full_name,
  role,
  account_type,
  status,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================
-- CHANGE USER ROLES
-- ============================================

-- Make someone an ADMIN (full system access)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'user@example.com';

-- Make someone an INSTRUCTOR (can create courses)
UPDATE profiles 
SET role = 'instructor'
WHERE email = 'user@example.com';

-- Make someone a LEARNER (default student)
UPDATE profiles 
SET role = 'learner'
WHERE email = 'user@example.com';

-- Make someone a MENTOR (can guide students)
UPDATE profiles 
SET role = 'mentor'
WHERE email = 'user@example.com';

-- Make someone an EMPLOYER (B2B access)
UPDATE profiles 
SET role = 'employer', account_type = 'b2b'
WHERE email = 'user@example.com';

-- ============================================
-- BULK OPERATIONS
-- ============================================

-- Make all users created today instructors
UPDATE profiles 
SET role = 'instructor'
WHERE DATE(created_at) = CURRENT_DATE
AND role = 'learner';

-- Count users by role
SELECT 
  role,
  COUNT(*) as user_count
FROM profiles
GROUP BY role
ORDER BY user_count DESC;

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Find all admins
SELECT email, first_name, last_name 
FROM profiles 
WHERE role = 'admin';

-- Find all instructors
SELECT email, first_name, last_name 
FROM profiles 
WHERE role = 'instructor';

-- Find suspended users
SELECT email, first_name, last_name, status
FROM profiles 
WHERE status = 'suspended';

-- Reactivate a suspended user
UPDATE profiles 
SET status = 'active'
WHERE email = 'user@example.com';
