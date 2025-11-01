# 🔍 WHY INSTRUCTOR ROLE ISN'T SAVING

## 🎯 **ROOT CAUSE FOUND!**

### **The Problem**:
Your database has **Row Level Security (RLS)** policies that are **BLOCKING** admin users from updating other users' roles.

### **Current Situation**:
- ✅ Role 'instructor' IS valid in database schema
- ✅ Your code is correct
- ✅ UI is working
- ❌ **RLS policy is blocking the update!**

---

## 🔒 **What is RLS?**

Row Level Security (RLS) is Supabase's security feature that controls who can read/write which rows.

**Current Policy** (too restrictive):
```sql
"Users can update own profile" 
USING (auth.uid() = id)
```

This means: **"Users can ONLY update their OWN profile"**

**Result**: When you (admin) try to update another user's role → **BLOCKED!** ❌

---

## ✅ **THE FIX**

You need to add a policy that allows **admins** to update **any** profile.

---

## 🚀 **APPLY THE FIX NOW** (2 minutes)

### **Step 1: Open Supabase SQL Editor**
https://app.supabase.com/project/fmvezctjdjpedmdfvfea/sql/new

### **Step 2: Copy and Run This Script**

```sql
-- Fix RLS Policy to Allow Admin Updates

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create TWO new policies:

-- Policy 1: Users can update their own data (but not their role)
CREATE POLICY "Users can update own profile data" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Policy 2: Admins can update ANY profile (including roles)
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    role IN ('learner', 'instructor', 'mentor', 'employer', 'admin')
  );

-- Verify it worked
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
```

### **Step 3: You Should See**
```
policyname: "Users can update own profile data"
policyname: "Admins can update any profile"
```

✅ **SUCCESS!** Policies updated!

---

## 🧪 **TEST IT IMMEDIATELY**

### **Test 1: Manual SQL Update**

Still in SQL Editor, run:
```sql
-- Replace with actual emails
UPDATE profiles 
SET role = 'instructor', updated_at = NOW()
WHERE email = 'USER_TO_TEST@example.com'
RETURNING email, role, updated_at;
```

**Should see**: The user's role changed to 'instructor' ✅

---

### **Test 2: Via Admin Dashboard**

1. **Refresh your browser** (clear cached policies)
2. Go to **Admin Dashboard** → **Users**
3. Click **Edit** on a user
4. Change role to **"Instructor"**
5. Click **Save**
6. **Open browser console** (F12) → Check for logs
7. **Should see**:
   ```
   Attempting role update: { userId: "...", requestedRole: "instructor", dbRole: "instructor" }
   Supabase update response: [{ id: "...", role: "instructor", ... }]
   Role updated successfully
   ```

---

### **Test 3: Verify in Database**

```sql
SELECT 
  email, 
  role, 
  updated_at 
FROM profiles 
WHERE role = 'instructor';
```

**Should see**: Your test user with role = 'instructor' ✅

---

## 📊 **Understanding the Fix**

### **Before** (Too Restrictive):
```
Policy: "Users can update own profile"
Rule: ONLY update if auth.uid() = id

Result:
- User can update their own profile ✅
- Admin trying to update other users → BLOCKED ❌
```

### **After** (Proper Access Control):
```
Policy 1: "Users can update own profile data"
Rule: Can update own profile BUT NOT role

Policy 2: "Admins can update any profile"  
Rule: If you're admin, can update anyone

Result:
- Users can update their own data ✅
- Users CANNOT change their own role ✅
- Admins CAN update any user's role ✅
```

---

## 🎯 **After Applying Fix**

### **Workflow Will Be**:
1. Admin clicks Edit on user ✅
2. Admin changes role to Instructor ✅
3. **Update saves to database** ✅ (No more blocking!)
4. Success toast appears ✅
5. User logs out and back in ✅
6. User sees Instructor Dashboard ✅

---

## 🔍 **Verify RLS Policies**

```sql
-- See all UPDATE policies on profiles
SELECT 
  policyname,
  cmd,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND cmd = 'UPDATE';
```

**Should show**:
1. `Users can update own profile data` - for regular users
2. `Admins can update any profile` - for admins

---

## 🐛 **If Still Not Working**

### **Check 1: Are you actually admin?**
```sql
SELECT email, role FROM profiles WHERE id = auth.uid();
```
Must show `role = 'admin'`

### **Check 2: Is RLS enabled?**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
```
`rowsecurity` should be `true`

### **Check 3: Console Errors**
1. Open browser (F12)
2. Try updating role
3. Look for red errors
4. Share error message

---

## ✅ **Summary**

**Problem**: RLS policy blocking admin from updating users  
**Solution**: Add policy for admins to update any profile  
**File to Run**: `CRITICAL_FIX_RLS.sql` in Supabase SQL Editor  
**Result**: Admin can now change roles ✅

---

## 📁 **Files Created**

1. **`CRITICAL_FIX_RLS.sql`** ← Run this in Supabase NOW
2. **`fix-rls-policies.sql`** ← Alternative fix script
3. **`diagnose-role-issue.sql`** ← Diagnostic queries
4. **`WHY_INSTRUCTOR_NOT_SAVING.md`** ← This file (explanation)

---

## 🚀 **Action Items**

- [ ] Open Supabase SQL Editor
- [ ] Run `CRITICAL_FIX_RLS.sql` script
- [ ] Verify policies created
- [ ] Test manual SQL update
- [ ] Refresh browser
- [ ] Test via Admin Dashboard
- [ ] Check browser console for logs
- [ ] Verify in database
- [ ] Test user login as instructor

---

**App is running**: http://localhost:5173/  
**Enhanced logging**: Check browser console (F12) for detailed logs

**Run the SQL fix NOW and it will work!** 🎉
