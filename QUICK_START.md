# 🚀 QUICK START GUIDE

## ✅ STATUS: Application is Running!

**Your App**: http://localhost:5173/
**Supabase Project**: https://fmvezctjdjpedmdfvfea.supabase.co

---

## ⚡ 3-MINUTE SETUP

### 1️⃣ Setup Database (First Time Only)

**Go to**: https://app.supabase.com/project/fmvezctjdjpedmdfvfea/sql/new

**Do this ONCE**:

```
1. Open: supabase-schema.sql
2. Copy everything (Ctrl+A, Ctrl+C)
3. Paste in Supabase SQL Editor
4. Click "Run" button
5. Wait for "Success" message
```

Then:

```
1. Click "New Query"
2. Open: supabase-sample-data.sql
3. Copy, Paste, Run
4. See "5 rows" message
```

**Done!** ✓ Database ready

---

### 2️⃣ Enable Email Auth (Required for Registration)

**Go to**: https://app.supabase.com/project/fmvezctjdjpedmdfvfea/auth/providers

1. Scroll to **"Email"** provider
2. Make sure it's **ENABLED** (toggle on)
3. **Disable** "Confirm email" for testing:
   - Settings → Auth → Email Auth
   - Turn OFF "Confirm email"

**Why?** So you can register without email verification during testing.

---

### 3️⃣ Test the App

**Open**: http://localhost:5173/

#### Register:
1. Click "Sign Up"
2. Use: test@example.com / password123
3. Choose role: Instructor or Student
4. Register ✓

#### Browse:
1. Go to "Courses"
2. See categories loaded ✓

#### Create Course (as Instructor):
1. Click "Create Course"
2. Fill in details
3. Publish ✓

---

## 🔥 QUICK COMMANDS

```bash
# Start app
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 📊 CHECK DATABASE

**Tables to verify**:
- Go to: Table Editor in Supabase
- Should see: profiles, courses, enrollments, lessons, etc.

**Check your user**:
- Go to: Authentication → Users
- See your registered account

**Check categories**:
- Go to: Table Editor → categories
- See 5 sample categories

---

## ❌ TROUBLESHOOTING

**Problem**: Can't register
- **Fix**: Enable Email provider in Supabase Auth settings
- **Fix**: Disable "Confirm email" requirement

**Problem**: "relation does not exist"
- **Fix**: Run supabase-schema.sql script

**Problem**: No categories showing
- **Fix**: Run supabase-sample-data.sql script

**Problem**: "RLS policy violation"
- **Fix**: Schema script includes RLS. Re-run if needed.

---

## 📁 IMPORTANT FILES

- `supabase-schema.sql` - Database structure
- `supabase-sample-data.sql` - Sample categories/skills
- `.env` - Your Supabase credentials ✓ (already configured)
- `TESTING_GUIDE.md` - Detailed testing steps
- `SETUP.md` - Complete documentation

---

## 🎯 WHAT'S WORKING

✅ Supabase integration
✅ Real authentication
✅ Database structure
✅ Row Level Security
✅ Auto profile creation
✅ Course management
✅ Progress tracking
✅ User enrollments
✅ Categories & skills

---

## 🚀 YOU'RE READY!

1. Run the 2 SQL scripts in Supabase
2. Enable Email auth
3. Register an account at http://localhost:5173/
4. Start creating courses!

**Need help?** Check TESTING_GUIDE.md for detailed steps.
