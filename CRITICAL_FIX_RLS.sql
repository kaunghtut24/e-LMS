-- CRITICAL FIX: RLS Policy Blocking Role Updates
-- This is why instructor role isn't saving!
-- Run this ENTIRE script in Supabase SQL Editor

-- ==================================================
-- DIAGNOSIS: Current RLS Policy Issue
-- ==================================================
-- The existing policy "Users can update own profile" 
-- only allows users to update THEIR OWN profile.
-- Admins cannot update OTHER users' roles because of this!

-- ==================================================
-- SOLUTION: Add Admin Policy
-- ==================================================

-- Step 1: Check existing policies
SELECT 
  policyname,
  cmd,
  qual as "using_clause"
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'UPDATE';

-- Step 2: Drop restrictive policy (if it exists)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Step 3: Create TWO new policies

-- Policy 1: Users can update their own profile (but NOT their role)
CREATE POLICY "Users can update own profile data" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- Ensure user cannot change their own role
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Policy 2: Admins can update ANY user's profile (including role)
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE
  USING (
    -- Check if the current user is an admin
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    -- Admins can set any valid role
    role IN ('learner', 'instructor', 'mentor', 'employer', 'admin')
  );

-- Step 4: Verify policies are created
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual as "using_clause",
  with_check as "with_check_clause"
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'UPDATE'
ORDER BY policyname;

-- ==================================================
-- TESTING
-- ==================================================

-- Test 1: Check your admin status
-- Replace with YOUR email
SELECT 
  email, 
  role,
  id
FROM profiles 
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- Test 2: Try manual update as admin
-- This should work now!
-- Replace emails with actual ones
UPDATE profiles 
SET role = 'instructor', updated_at = NOW()
WHERE email = 'USER_TO_MAKE_INSTRUCTOR@example.com'
RETURNING email, role, updated_at;

-- Test 3: Verify all roles
SELECT 
  email,
  role,
  updated_at
FROM profiles
ORDER BY updated_at DESC;

-- ==================================================
-- If above works, your Admin Dashboard will work too!
-- ==================================================
