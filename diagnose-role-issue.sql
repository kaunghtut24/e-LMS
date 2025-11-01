-- Diagnostic: Why Instructor Role Isn't Saving
-- Run these queries step by step in Supabase SQL Editor

-- 1. Check current database constraint on role field
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'role';

-- 2. Check if there's a CHECK constraint on role
SELECT
  con.conname as constraint_name,
  pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'profiles'
  AND con.contype = 'c';

-- 3. Check RLS policies that might be blocking updates
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
WHERE tablename = 'profiles'
  AND cmd = 'UPDATE';

-- 4. Check what roles currently exist in the table
SELECT DISTINCT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY role;

-- 5. Test manual update (replace with actual user email)
-- This will show us the exact error if there is one
DO $$
DECLARE
  test_email TEXT := 'YOUR_TEST_USER_EMAIL@example.com'; -- CHANGE THIS
  update_result TEXT;
BEGIN
  -- Try to update
  UPDATE profiles 
  SET role = 'instructor'
  WHERE email = test_email;
  
  -- Check if it worked
  SELECT role INTO update_result FROM profiles WHERE email = test_email;
  
  RAISE NOTICE 'Update result for %: role is now %', test_email, update_result;
END $$;

-- 6. Try direct update with your actual user email
-- IMPORTANT: Replace with the email you're trying to make instructor
UPDATE profiles 
SET role = 'instructor',
    updated_at = NOW()
WHERE email = 'REPLACE_WITH_ACTUAL_EMAIL@example.com'
RETURNING email, role, updated_at;

-- 7. If above fails, check the exact error
-- Run this and look for error message
\set ON_ERROR_STOP on
UPDATE profiles SET role = 'instructor' WHERE email = 'test@test.com';
