-- Make Your Account an Admin
-- Run this in Supabase SQL Editor

-- Option 1: Update by email (replace with your email)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE@example.com';

-- Option 2: Make the first registered user admin
UPDATE profiles 
SET role = 'admin'
WHERE created_at = (SELECT MIN(created_at) FROM profiles);

-- Option 3: See all users and pick one to make admin
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  created_at
FROM profiles
ORDER BY created_at;

-- Then manually update: UPDATE profiles SET role = 'admin' WHERE id = 'PASTE_ID_HERE';

-- Verify the change
SELECT email, role, first_name, last_name FROM profiles;
