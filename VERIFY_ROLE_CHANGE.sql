-- Verify Role Changes in Database
-- Run these queries to check if roles are being saved

-- 1. Check all users and their current roles
SELECT 
  email,
  first_name || ' ' || last_name as name,
  role,
  status,
  last_login,
  updated_at
FROM profiles
ORDER BY updated_at DESC;

-- 2. Check a specific user by email (replace with actual email)
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  updated_at
FROM profiles 
WHERE email = 'YOUR_EMAIL_HERE@example.com';

-- 3. Manually set a user as instructor (if update via UI fails)
UPDATE profiles 
SET 
  role = 'instructor',
  updated_at = NOW()
WHERE email = 'USER_TO_MAKE_INSTRUCTOR@example.com';

-- Verify the change
SELECT email, role, updated_at FROM profiles WHERE email = 'USER_TO_MAKE_INSTRUCTOR@example.com';

-- 4. Check RLS policies on profiles table (might be blocking updates)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
