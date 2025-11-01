# 🧪 Role Update Testing Guide

## ✅ **Fixes Applied**

1. ✅ Updated `updateUserRole` function to accept all 5 roles
2. ✅ Added proper error handling and logging
3. ✅ Added toast notifications for success/failure
4. ✅ Added warning that user must log out to see changes
5. ✅ Server restarted with all changes

---

## 🎯 **IMPORTANT: How Role Changes Work**

When you change a user's role:
1. ✅ Database is updated immediately
2. ✅ Admin sees the change in the user list
3. ⚠️ **The affected user MUST log out and log back in** to see their new role

**Why?** The user's role is cached in their session. Logging out clears the session and reloads it from the database.

---

## 🧪 **Step-by-Step Testing**

### **STEP 1: Make Yourself Admin** (if not already)

1. Open Supabase SQL Editor:
   https://app.supabase.com/project/fmvezctjdjpedmdfvfea/sql/new

2. Run this (replace with YOUR email):
   ```sql
   UPDATE profiles 
   SET role = 'admin'
   WHERE email = 'YOUR_EMAIL@example.com';
   
   -- Verify
   SELECT email, role FROM profiles WHERE email = 'YOUR_EMAIL@example.com';
   ```

3. **Log out** from the app
4. **Log back in**
5. **Verify**: You should see "Admin Dashboard" option

---

### **STEP 2: Register a Test User**

1. Open: http://localhost:5173/register
2. Register with:
   - Email: `testinstructor@test.com`
   - Password: `Test123456!`
   - First Name: Test
   - Last Name: Instructor
3. **After registration, log out** (this user starts as "learner")

---

### **STEP 3: Promote Test User to Instructor (as Admin)**

1. **Log in as admin** (your main account)
2. Go to **Admin Dashboard**
3. Click **"Users"** tab
4. Find **testinstructor@test.com** in the list
5. Click **Edit** button (pencil icon) on that row
6. **Verify modal shows**:
   - ✅ First Name: Test
   - ✅ Last Name: Instructor  
   - ✅ Email: testinstructor@test.com
   - ✅ Role dropdown with 5 options
7. **Select role**: "Instructor (Teacher)"
8. **Click "Save Changes"**
9. **Expected**: 
   - ✅ Success toast appears
   - ✅ Message says: "User role updated to instructor. User must log out and log back in to see changes."
   - ✅ Modal closes
   - ✅ User table updates

---

### **STEP 4: Verify Database Updated**

1. Go to Supabase SQL Editor
2. Run:
   ```sql
   SELECT email, role, updated_at 
   FROM profiles 
   WHERE email = 'testinstructor@test.com';
   ```

3. **Expected result**:
   - role: `instructor` ✅
   - updated_at: shows recent timestamp ✅

---

### **STEP 5: Test Instructor Access**

1. **Log out as admin**
2. **Log in as testinstructor@test.com** / Test123456!
3. **Expected**:
   - ✅ Should see **"Instructor Dashboard"** option in menu
   - ✅ Should see **"Create Course"** button
   - ✅ Should NOT see "Admin Dashboard"
4. **Click "Create Course"** → Should work! ✅

---

### **STEP 6: Create a Test Course (as Instructor)**

1. Still logged in as testinstructor@test.com
2. Click **"Create Course"** button
3. Fill in basic info:
   - Title: "My First Course"
   - Description: "Testing instructor features"
   - Category: Web Development
   - Level: Beginner
   - Price: $29.99
4. Click **"Curriculum"** tab
5. Click **"Add Module"**:
   - Module title: "Introduction"
   - Description: "Getting started"
6. Click **"Add Lesson"**:
   - Lesson title: "Welcome Video"
   - Type: **Video**
7. **In Video Editor**:
   - Source: Select **"YouTube"**
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Duration: "3:32"
8. **Save Lesson**
9. **Save Course**

**Expected**: ✅ Course created successfully!

---

## 🔍 **Verification Queries**

### Check All Users and Roles:
```sql
SELECT 
  email,
  first_name || ' ' || last_name as name,
  role,
  status,
  created_at,
  last_login,
  updated_at
FROM profiles
ORDER BY created_at DESC;
```

### Check Specific User:
```sql
SELECT * FROM profiles WHERE email = 'testinstructor@test.com';
```

### Check All Instructors:
```sql
SELECT 
  email,
  first_name || ' ' || last_name as name,
  role,
  last_login
FROM profiles
WHERE role = 'instructor';
```

### Check RLS Policies (if role update fails):
```sql
-- See if RLS is blocking updates
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## 🐛 **Troubleshooting**

### **Problem**: "Role not updating in database"

**Check 1 - Console Errors**:
1. Open browser console (F12)
2. Try updating role
3. Look for errors in console
4. Check Network tab for failed requests

**Check 2 - RLS Policies**:
```sql
-- Temporarily check if RLS is the issue
SELECT * FROM profiles WHERE id = 'USER_ID_HERE';

-- If you can't see the user, RLS might be blocking
-- Make sure you're authenticated as admin
```

**Solution**: Run this to ensure admin can update:
```sql
-- Add policy for admin to update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
```

---

### **Problem**: "User still shows old role after update"

**Solution**: User must log out and back in!
1. Click Logout
2. Clear browser cache (optional): F12 → Application → Clear Storage
3. Log back in
4. Role should be updated ✅

---

### **Problem**: "Cannot see Create Course button as instructor"

**Check**:
```sql
-- Verify role is actually 'instructor' in DB
SELECT email, role FROM profiles WHERE email = 'testinstructor@test.com';
```

**If shows 'learner'**: Role update didn't save. Check console errors.

**If shows 'instructor'**: User didn't log out. Force logout and login.

---

### **Problem**: "Modal doesn't open when clicking Edit"

**Solution**: 
1. Check browser console for errors
2. Refresh page
3. Try another user

---

## ✅ **Success Checklist**

Test is successful when:

- [  ] Admin can open User Management table
- [  ] Admin can click Edit on any user
- [  ] Modal shows with correct user data
- [  ] Dropdown shows all 5 roles with descriptions
- [  ] Can select "Instructor" role
- [  ] Save shows success toast
- [  ] Database shows role = 'instructor'
- [  ] User logs out
- [  ] User logs back in
- [  ] User sees "Instructor Dashboard"
- [  ] User can access "Create Course"
- [  ] User can create course with video lessons
- [  ] Course saves successfully

---

## 📋 **Quick Test Commands**

```sql
-- Make yourself admin
UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL';

-- Create a test instructor
UPDATE profiles SET role = 'instructor' WHERE email = 'test@test.com';

-- Create a test learner
UPDATE profiles SET role = 'learner' WHERE email = 'student@test.com';

-- View all roles
SELECT email, role FROM profiles ORDER BY role;

-- Reset everyone to learner (for testing)
UPDATE profiles SET role = 'learner' WHERE role != 'admin';
```

---

## 🎯 **Expected Flow Summary**

1. **Admin logs in** → Sees Admin Dashboard
2. **Admin opens Users** → Sees all users with current roles
3. **Admin clicks Edit on user** → Modal opens with role dropdown
4. **Admin changes role to Instructor** → Saves successfully
5. **Database updates** → role = 'instructor'
6. **That user logs out and back in** → Now sees Instructor features
7. **Instructor can create courses** → Full course builder access
8. **Learner enrolls in course** → Can watch and learn

---

**Ready to test? Start with STEP 1!** 🚀

**App is running at**: http://localhost:5173/
