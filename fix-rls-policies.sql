-- Fix RLS Policies to Allow Admin to Update Roles
-- Run this in Supabase SQL Editor

-- First, let's check current policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

-- Drop the existing "Users can update own profile" policy
-- This might be too restrictive
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create more permissive update policies

-- 1. Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- 2. Admins can update ANY profile (including roles)
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND cmd = 'UPDATE';

-- Test: Try to update a role as admin
-- Replace with your admin email and target user email
DO $$
DECLARE
  admin_id UUID;
  target_user_email TEXT := 'USER_TO_CHANGE@example.com'; -- CHANGE THIS
BEGIN
  -- Get admin's ID (replace with your admin email)
  SELECT id INTO admin_id FROM profiles WHERE email = 'YOUR_ADMIN_EMAIL@example.com'; -- CHANGE THIS
  
  -- Try update
  UPDATE profiles 
  SET role = 'instructor'
  WHERE email = target_user_email;
  
  RAISE NOTICE 'Update attempted. Check the role now.';
END $$;

-- Verify the change
SELECT email, role, updated_at FROM profiles ORDER BY updated_at DESC LIMIT 5;
