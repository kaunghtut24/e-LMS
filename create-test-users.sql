-- Create Test Users with Different Roles
-- NOTE: This requires users to exist in auth.users first
-- Better approach: Register manually then update role

-- After users register, assign roles like this:

-- Make second user an instructor
UPDATE profiles 
SET role = 'instructor'
WHERE email = 'teacher@example.com';

-- Make third user a mentor  
UPDATE profiles 
SET role = 'mentor'
WHERE email = 'mentor@example.com';

-- Make fourth user remain as learner (default)
-- No update needed for: student@example.com

-- Create organization for B2B testing
INSERT INTO organizations (name, type, industry, description)
VALUES (
  'Tech Corp Inc.',
  'employer',
  'Technology',
  'Sample B2B organization for testing'
)
RETURNING id, name;

-- Then assign employer user to this org:
-- UPDATE profiles 
-- SET role = 'employer', 
--     account_type = 'b2b',
--     organization_id = 'PASTE_ORG_ID_HERE'
-- WHERE email = 'employer@techcorp.com';
