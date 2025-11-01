# 🧪 Role Testing Guide

## ✅ **What Was Fixed**

### 1. **Admin Dashboard - Role Editing** ✓
- **Issue**: Role dropdown showed "student" but database uses "learner"
- **Fix**: Updated UserFormModal to use correct database values
- **Now Shows**: 
  - Learner (Student)
  - Instructor (Teacher)
  - Mentor (Guide)
  - Employer (B2B)
  - Admin (Full Access)
- **Added**: Role descriptions to help admins understand each role

### 2. **Instructor - Video Embedding** ✓
- **Enhanced**: Video lesson editor with multiple embed options
- **Now Supports**:
  - ✅ YouTube videos (URL or ID)
  - ✅ Vimeo videos (URL or ID)
  - ✅ Custom embed codes (any platform)
  - ✅ Direct video upload
  - ✅ Video transcripts
  - ✅ Timestamped notes
  - ✅ Download controls

### 3. **Content Creation Tools** ✓
- ✅ Rich text editor for text lessons
- ✅ Quiz builder (multiple choice, T/F, short answer, essay)
- ✅ Assignment creator with rubrics
- ✅ Interactive content support
- ✅ Downloadable resources

---

## 🧪 **Testing Checklist**

### **TEST 1: Admin Can Edit User Roles** ⭐ PRIORITY

1. **Setup**:
   ```sql
   -- Make yourself admin (if not already)
   UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';
   ```

2. **Test Steps**:
   - Log in as admin
   - Go to **Admin Dashboard**
   - Click **"Users"** tab
   - Find a user in the table
   - Click **"Edit"** button (pencil icon)
   - **Verify**: Modal opens with role dropdown
   - **Verify**: See all 5 roles:
     - Learner (Student)
     - Instructor (Teacher)
     - Mentor (Guide)
     - Employer (B2B)
     - Admin (Full Access)
   - Select "Instructor"
   - Click "Save Changes"
   - **Verify**: Success message appears
   - **Verify**: Check database:
     ```sql
     SELECT email, role FROM profiles WHERE email = 'CHANGED_USER@example.com';
     ```
   - **Result**: Role should be 'instructor' ✓

3. **Expected Result**: ✅ Admin can successfully change user roles

---

### **TEST 2: Instructor Can Create Course with Videos**

1. **Setup**:
   ```sql
   -- Make a test user an instructor
   UPDATE profiles SET role = 'instructor' WHERE email = 'teacher@test.com';
   ```

2. **Test Steps**:
   - Log in as instructor
   - Go to **Instructor Dashboard**
   - Click **"Create Course"** button
   - Fill in basic info:
     - Title: "Test Course"
     - Description: "Testing video features"
     - Category: Web Development
     - Level: Beginner
     - Price: $29.99
   - Go to **"Curriculum"** tab
   - Click **"Add Module"**
   - Name module: "Introduction"
   - Click **"Add Lesson"**
   - Select lesson type: **"Video"**
   - **Verify**: Video editor opens
   - **Verify**: See "Video Source" dropdown with:
     - Direct URL
     - YouTube
     - Vimeo
     - Embed Code
     - Upload File

3. **Test YouTube Embedding**:
   - Select source: **YouTube**
   - Paste: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - OR paste just ID: `dQw4w9WgXcQ`
   - Add video duration: "3:32"
   - Add transcript (optional)
   - Enable "Allow download"
   - Enable "Timestamped notes"
   - Click "Save Lesson"

4. **Expected Result**: ✅ Lesson saved with YouTube video

5. **Test Vimeo/Embed**:
   - Add another lesson
   - Try Vimeo URL
   - Try custom embed code:
     ```html
     <iframe src="https://player.vimeo.com/video/123456789" width="640" height="360"></iframe>
     ```

6. **Expected Result**: ✅ Multiple video types supported

---

### **TEST 3: Different Dashboards for Each Role**

1. **Create Test Accounts**:
   ```sql
   -- Register these accounts manually, then run:
   UPDATE profiles SET role = 'learner' WHERE email = 'student@test.com';
   UPDATE profiles SET role = 'instructor' WHERE email = 'teacher@test.com';
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
   ```

2. **Test Learner Dashboard**:
   - Log in as `student@test.com`
   - **Verify**: See "My Courses", "Continue Learning"
   - **Verify**: Can browse and enroll in courses
   - **Verify**: No "Create Course" button
   - **Verify**: No "Admin Dashboard" option

3. **Test Instructor Dashboard**:
   - Log in as `teacher@test.com`
   - **Verify**: See "Instructor Dashboard"
   - **Verify**: See "Create Course" button
   - **Verify**: See "My Courses" (courses I created)
   - **Verify**: No "Admin Dashboard" option
   - **Verify**: Can create/edit own courses

4. **Test Admin Dashboard**:
   - Log in as `admin@test.com`
   - **Verify**: See "Admin Dashboard" option
   - **Verify**: Can access User Management
   - **Verify**: Can edit ANY course
   - **Verify**: Can change user roles
   - **Verify**: See platform analytics

---

### **TEST 4: Role Permissions**

1. **Learner Restrictions**:
   - Try accessing `/admin` URL directly → Should redirect
   - Try accessing `/instructor/create-course` → Should redirect
   - Can only access own enrolled courses

2. **Instructor Restrictions**:
   - Try accessing `/admin` → Should redirect
   - CAN access `/instructor/create-course`
   - CAN edit own courses
   - CANNOT edit others' courses

3. **Admin Full Access**:
   - Can access ANY URL
   - Can see all users and courses
   - Can modify anything

---

## 🎯 **Quick Verification**

### **Check Current User Roles**:
```sql
SELECT 
  email, 
  role,
  first_name || ' ' || last_name as name,
  status,
  created_at
FROM profiles
ORDER BY created_at DESC;
```

### **Change Roles Quickly**:
```sql
-- Make instructor
UPDATE profiles SET role = 'instructor' WHERE email = 'user@test.com';

-- Make admin
UPDATE profiles SET role = 'admin' WHERE email = 'user@test.com';

-- Make learner
UPDATE profiles SET role = 'learner' WHERE email = 'user@test.com';
```

---

## 📋 **Feature Verification Checklist**

### Admin Dashboard:
- [ ] Can open User Management
- [ ] Can see Edit button on each user
- [ ] Modal shows all 5 role options
- [ ] Role dropdown values are correct (learner, not student)
- [ ] Can save role changes
- [ ] Changes reflect in database
- [ ] User sees new dashboard after role change

### Instructor Course Creation:
- [ ] Can access "Create Course" page
- [ ] Can add modules
- [ ] Can add lessons
- [ ] Video lesson type available
- [ ] YouTube embedding works
- [ ] Vimeo embedding works
- [ ] Custom embed code works
- [ ] Can add transcripts
- [ ] Can enable/disable features
- [ ] Can save and publish course

### Content Editor Features:
- [ ] Text lessons with rich formatting
- [ ] Video lessons with multiple sources
- [ ] Quiz creation with various question types
- [ ] Assignment creation with rubrics
- [ ] Resource attachments
- [ ] Preview functionality

---

## 🐛 **Common Issues & Solutions**

### **Issue**: "Role not updating in Admin Dashboard"
**Solution**: 
1. Check if UserFormModal is using 'learner' not 'student'
2. Clear browser cache and reload
3. Log out and log back in

### **Issue**: "Cannot create course as instructor"
**Solution**:
```sql
-- Verify role is correct
SELECT role FROM profiles WHERE email = 'YOUR_EMAIL';
-- Should show 'instructor', not 'learner'
```

### **Issue**: "Video not embedding properly"
**Solution**:
- Check video source is selected
- For YouTube: Use full URL or just video ID
- For Vimeo: Ensure public video
- For embed: Check iframe code is valid

### **Issue**: "User sees wrong dashboard"
**Solution**:
- Log out completely
- Clear browser storage (F12 → Application → Clear)
- Log back in

---

## ✅ **Success Criteria**

Your system is working correctly when:

1. ✅ Admin can edit user roles via dashboard
2. ✅ Role changes persist in database
3. ✅ Users see correct dashboard for their role
4. ✅ Instructors can create courses
5. ✅ Video embedding works (YouTube, Vimeo, embed)
6. ✅ All content types are creatable
7. ✅ Learners can enroll and learn
8. ✅ Role permissions are enforced

---

## 📚 **Reference Files**

- `ROLE_FEATURES.md` - Complete role capabilities
- `make-admin.sql` - Make yourself admin
- `role-management.sql` - Manage all roles
- `ADMIN_SETUP.md` - Admin setup guide

---

**Ready to test?** Start with TEST 1 - verify admin can edit roles! 🚀
