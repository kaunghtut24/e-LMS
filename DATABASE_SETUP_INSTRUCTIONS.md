# Database Setup Instructions

## Step 1: Run Schema Script in Supabase

1. **Go to your Supabase project**: https://app.supabase.com
2. **Navigate to SQL Editor** (left sidebar)
3. **Click "New Query"**
4. **Copy the entire contents** of `supabase-schema.sql`
5. **Paste into the SQL editor**
6. **Click "Run"** button (or press Ctrl+Enter)

This will create:
- ✅ All 10 required tables
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating timestamps
- ✅ Function to auto-create user profiles on signup

**Expected Result**: "Success. No rows returned"

---

## Step 2: Add Sample Data

1. **Still in SQL Editor**, click "New Query"
2. **Copy contents** of `supabase-sample-data.sql`
3. **Paste and Run**

This adds:
- ✅ 5 sample categories (Web Dev, Programming, Data Science, Design, Business)
- ✅ 5 sample skills

---

## Step 3: Verify Database

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - categories ✓
   - course_modules ✓
   - courses ✓
   - enrollments ✓
   - lesson_progress ✓
   - lessons ✓
   - organizations ✓
   - profiles ✓
   - skills ✓
   - user_notes ✓

---

## Step 4: Check RLS Policies

1. Click on any table in Table Editor
2. Look for **"RLS enabled"** badge
3. Click **"View Policies"** to see security rules

---

## Common Issues

**Issue**: "relation already exists"
- **Solution**: Tables already created. Skip to Step 2.

**Issue**: "permission denied"
- **Solution**: You need to be project owner/admin.

**Issue**: "function does not exist"
- **Solution**: Run schema script again, it includes all functions.

---

## Next Steps

After database is set up:
1. Start the dev server: `npm run dev`
2. Register a new account
3. Your profile will be auto-created
4. Start creating courses!
