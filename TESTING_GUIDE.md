# Testing Guide for e-LMS

## Application is running at: http://localhost:5173/

---

## Test 1: User Registration ✓

1. Open http://localhost:5173/
2. Click **"Sign Up"** or **"Register"**
3. Fill in:
   - First Name: Test
   - Last Name: Instructor
   - Email: test@example.com
   - Password: Test123456!
   - Role: Instructor (if available)
4. Click **"Register"**
5. Should redirect to dashboard

**Expected Result**: 
- User created in Supabase Auth
- Profile automatically created in profiles table
- Logged in successfully

---

## Test 2: Profile Check ✓

1. In Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - See your new user listed
2. Go to **Table Editor** → **profiles**
   - See your profile row with first_name, last_name, email

**Expected Result**: Profile exists with correct data

---

## Test 3: Browse Categories ✓

1. In the app, navigate to **Courses** or **Browse**
2. Should see categories:
   - Web Development
   - Programming
   - Data Science
   - Design
   - Business

**Expected Result**: Categories load from database

---

## Test 4: Create a Course (Instructor) ✓

1. Navigate to **Instructor Dashboard** or **Create Course**
2. Fill in course details:
   - Title: "Introduction to React"
   - Description: "Learn React from scratch"
   - Category: Web Development
   - Level: Beginner
   - Price: $49.99
3. Add at least one module and lesson
4. Click **"Publish"** or **"Save"**

**Expected Result**: 
- Course created in database
- Appears in your instructor dashboard
- Can be viewed in courses list

---

## Test 5: Enroll in Course (Learner) ✓

1. Switch role or create new user with "Learner" role
2. Browse courses
3. Click on a course
4. Click **"Enroll"**
5. Go to **My Courses** or **Dashboard**

**Expected Result**:
- Enrollment created in database
- Course appears in learner's dashboard
- Can access course content

---

## Test 6: Track Progress ✓

1. As enrolled learner, open a course
2. Click on a lesson
3. Mark as complete or watch video
4. Check dashboard

**Expected Result**:
- Progress saved in lesson_progress table
- Progress percentage updates
- Dashboard shows completion %

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
**Fix**: Check `.env` file has correct credentials

### Error: "relation does not exist"
**Fix**: Run `supabase-schema.sql` in Supabase SQL Editor

### Error: "RLS policy violation" 
**Fix**: Ensure RLS policies were created (they're in schema script)

### Cannot register/login
**Fix**: 
1. Check Supabase Auth is enabled
2. Go to Authentication → Providers → Enable Email provider
3. Disable email confirmation for testing (Settings → Auth → Email Auth → Disable Confirm email)

### Categories not showing
**Fix**: Run `supabase-sample-data.sql` script

---

## Database Inspection

Check data in Supabase:

1. **Users**: Authentication → Users
2. **Profiles**: Table Editor → profiles
3. **Courses**: Table Editor → courses
4. **Enrollments**: Table Editor → enrollments
5. **Progress**: Table Editor → lesson_progress

---

## Important Notes

1. **Auto Profile Creation**: When a user registers via Supabase Auth, a profile is automatically created via database trigger

2. **RLS Security**: Row Level Security is enabled. Users can only:
   - See published courses (or their own drafts)
   - Modify their own data
   - Enroll themselves in courses

3. **Real-time Updates**: Supabase supports real-time subscriptions (can be added later)

4. **Sample Data**: Only categories and skills have sample data. Courses must be created by users.

---

## Next Steps After Testing

1. ✅ Registration works
2. ✅ Login works  
3. ✅ Courses can be created
4. ✅ Enrollment works
5. ✅ Progress tracking works

Then:
- Customize the UI/theme
- Add more course content
- Configure email notifications
- Deploy to production
