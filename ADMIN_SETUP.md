# 👑 Admin Setup Guide

## You Need Admin Access

Since you successfully registered, your account is currently a **"learner"** (student).  
To access admin features, you need to upgrade your role.

---

## ⚡ QUICK ADMIN SETUP (2 minutes)

### Step 1: Find Your Email

In Supabase SQL Editor, run:
```sql
SELECT email, first_name, last_name, role 
FROM profiles;
```

Copy your email address.

---

### Step 2: Make Yourself Admin

Replace `YOUR_EMAIL_HERE` with your actual email:

```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE@example.com';
```

**Example:**
```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'instructor@example.com';
```

---

### Step 3: Verify

```sql
SELECT email, role FROM profiles;
```

Should show your email with `role = 'admin'` ✅

---

### Step 4: Refresh App

1. **Log out** from the app (http://localhost:5173/)
2. **Log back in**
3. **Click Dashboard** - should now see "Admin Dashboard"! 🎉

---

## 🎯 What You Can Do As Admin

### Admin Dashboard Features:
- ✅ **User Management**: View all users, change roles, suspend accounts
- ✅ **Course Management**: Manage all courses (not just your own)
- ✅ **Analytics**: View platform statistics and metrics
- ✅ **System Settings**: Configure platform settings

### You Can Also Be Instructor:
As admin, you can create courses too! Just go to "Create Course" and start building content.

---

## 👥 Promoting Other Users

### Via Admin Dashboard (Recommended):
1. Log in as admin
2. Go to Admin Dashboard → Users
3. Find user → Click Edit → Change role → Save

### Via SQL (Quick):
```sql
-- Make someone an instructor
UPDATE profiles 
SET role = 'instructor'
WHERE email = 'teacher@example.com';

-- Make someone a learner
UPDATE profiles 
SET role = 'learner'
WHERE email = 'student@example.com';
```

---

## 📊 Role Hierarchy

```
Admin > Instructor > Mentor > Learner
```

- **Admin**: Full system access
- **Instructor**: Can create & manage courses
- **Mentor**: Can guide assigned students  
- **Learner**: Can enroll and learn
- **Employer**: B2B organizational access

---

## 🔒 Security Note

**Why roles aren't in registration form?**

For security! We don't want random people registering as admins or instructors.

**Proper workflow:**
1. User registers (gets "learner" role)
2. Admin reviews and promotes them
3. Or admin manually creates SQL update

This prevents abuse and unauthorized access.

---

## ✅ Next Steps After Becoming Admin

1. [ ] Log back in as admin
2. [ ] Explore Admin Dashboard
3. [ ] Create a test instructor account
4. [ ] Create a test course as instructor
5. [ ] Enroll as learner and test the full flow

---

## 🆘 Troubleshooting

**"Still don't see Admin Dashboard"**
- Did you log out and back in?
- Run SQL verify: `SELECT role FROM profiles WHERE email = 'your@email.com'`
- Should show 'admin', not 'learner'

**"Can't access Admin Dashboard"**  
- Check RoleDashboardRouter.tsx handles admin role
- Check ProtectedRoute allows admin access

**"Want to test instructor features"**
- As admin, you can create courses
- Or create separate instructor account and promote it

---

## 📁 Files to Reference

- `make-admin.sql` - Quick admin upgrade script
- `role-management.sql` - All role management queries
- `create-test-users.sql` - Testing multiple roles

---

## 🎓 Recommended Test Flow

1. **Register 3 accounts**:
   - admin@test.com (make admin via SQL)
   - teacher@test.com (promote to instructor via admin panel)
   - student@test.com (leave as learner)

2. **Test as instructor**:
   - Log in as teacher@test.com
   - Create a course
   - Add modules and lessons
   - Publish course

3. **Test as learner**:
   - Log in as student@test.com
   - Enroll in course
   - Complete lessons
   - Track progress

4. **Test as admin**:
   - Log in as admin@test.com
   - View all users and courses
   - Manage platform settings
   - View analytics

---

**You're all set! Make yourself admin and start exploring!** 🚀
