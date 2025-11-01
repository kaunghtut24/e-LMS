# 🎭 Role-Based Features & Dashboards

## Overview

The e-LMS system has 5 distinct user roles, each with specific access levels and features.

---

## 👤 **LEARNER (Student)**

### Dashboard Features:
- **My Courses**: Enrolled courses with progress
- **Continue Learning**: Resume where you left off
- **Progress Tracking**: Visual completion metrics
- **Achievements**: Badges and certificates earned
- **Recommended Courses**: AI-suggested courses

### Capabilities:
✅ Browse and search courses  
✅ Enroll in courses (free or paid)  
✅ Watch video lessons  
✅ Complete quizzes and assignments  
✅ Take notes (timestamped for videos)  
✅ Bookmark lessons  
✅ Participate in discussions  
✅ Rate and review courses  
✅ Track learning progress  
✅ Download certificates  

### Cannot Do:
❌ Create courses  
❌ Manage other users  
❌ Access admin features  

---

## 👨‍🏫 **INSTRUCTOR (Teacher)**

### Dashboard Features:
- **My Courses**: All courses I created
- **Student Analytics**: Enrollment and completion rates
- **Revenue Tracking**: Earnings from courses
- **Course Performance**: Views, ratings, engagement
- **Student Management**: View enrolled students
- **Discussion Moderation**: Respond to student questions

### Capabilities:
✅ Everything a Learner can do, PLUS:  
✅ **Create new courses**  
✅ **Edit own courses**  
✅ **Add/edit/delete lessons**  
✅ **Upload videos** (YouTube, Vimeo, direct upload)  
✅ **Embed videos** from any platform  
✅ **Create quizzes** with multiple question types  
✅ **Create assignments** with rubrics  
✅ **Add rich text content** with images  
✅ **Add downloadable resources**  
✅ **Set course pricing**  
✅ **Publish/unpublish courses**  
✅ **View student progress** in their courses  
✅ **Grade assignments**  
✅ **Respond to discussions**  
✅ **Moderate course reviews**  
✅ **Access course analytics**  

### Content Creation Tools:
- **Video Lessons**:
  - YouTube embedding (auto-detect from URL)
  - Vimeo embedding
  - Direct video upload (.mp4, .webm)
  - Custom embed code support
  - Video transcripts for accessibility
  - Timestamped notes
  - Thumbnail customization
  
- **Text Lessons**:
  - Rich text editor
  - Image embedding
  - Code blocks (syntax highlighting)
  - Formatting (bold, italic, lists)
  
- **Quizzes**:
  - Multiple choice questions
  - True/False questions
  - Short answer questions
  - Essay questions
  - Automatic grading (MC, T/F)
  - Custom feedback per question
  - Time limits
  - Passing scores
  
- **Assignments**:
  - Instructions and requirements
  - File upload submissions
  - Text submissions
  - Link submissions
  - Grading rubrics
  - Manual grading
  - Feedback and comments
  
- **Interactive Content**:
  - Embedded H5P content
  - Custom HTML/JS widgets
  - External tools (CodePen, JSFiddle)
  
- **Resources**:
  - PDF downloads
  - Code files
  - Templates
  - External links

### Cannot Do:
❌ Access Admin Dashboard  
❌ Manage other instructors' courses  
❌ Change user roles  
❌ Access system settings  

---

## 🎓 **MENTOR (Guide)**

### Dashboard Features:
- **My Students**: Students assigned to mentor
- **Student Progress**: Detailed learning analytics
- **Mentoring Sessions**: Scheduled meetings
- **Feedback Tracking**: Given/received feedback
- **Discussion Monitoring**: Student questions

### Capabilities:
✅ Everything a Learner can do, PLUS:  
✅ View assigned students' progress  
✅ Provide personalized guidance  
✅ Schedule mentoring sessions  
✅ Give feedback on assignments  
✅ Monitor discussion participation  
✅ Recommend courses to students  
✅ Track student goals  

### Cannot Do:
❌ Create courses (unless also an Instructor)  
❌ Access all users' data  
❌ Change course content  

---

## 🏢 **EMPLOYER (B2B)**

### Dashboard Features:
- **Organization Courses**: Company training catalog
- **Employee Management**: Assign courses to employees
- **Team Analytics**: Department-wide progress
- **Compliance Tracking**: Required training completion
- **Budget Management**: Training costs and ROI

### Capabilities:
✅ Manage organization members  
✅ Assign courses to employees  
✅ Create private organizational courses  
✅ View team learning analytics  
✅ Track compliance requirements  
✅ Generate reports  
✅ Set learning paths  
✅ Bulk enroll employees  

### Cannot Do:
❌ Access other organizations' data  
❌ Manage platform-wide settings  

---

## 👑 **ADMIN (Full Access)**

### Dashboard Features:
- **System Overview**: Platform-wide analytics
- **User Management**: All users and roles
- **Course Management**: All courses on platform
- **Content Moderation**: Review flagged content
- **System Settings**: Platform configuration
- **Reports & Analytics**: Detailed insights

### Capabilities:
✅ **FULL SYSTEM ACCESS**  
✅ Everything all other roles can do, PLUS:  
✅ **Manage all users**  
✅ **Change user roles** (via Admin Dashboard)  
✅ **Suspend/activate accounts**  
✅ **Delete users**  
✅ **View all courses** (even drafts)  
✅ **Edit any course**  
✅ **Delete any course**  
✅ **Moderate all content**  
✅ **Access system settings**  
✅ **View platform analytics**  
✅ **Manage categories and skills**  
✅ **Configure payment settings**  
✅ **Manage organizations**  
✅ **Export data**  
✅ **View audit logs**  

### Admin-Only Features:
- **User Management Table**:
  - Edit button → Opens UserFormModal
  - Change role dropdown (Learner, Instructor, Mentor, Employer, Admin)
  - Suspend/Activate toggle
  - Delete user button
  
- **Course Management**:
  - Approve/reject instructor submissions
  - Feature courses
  - Bulk operations
  
- **System Configuration**:
  - Platform settings
  - Email templates
  - Payment gateway setup
  - SEO settings

---

## 🔄 **Role Management**

### How to Change User Roles:

#### Method 1: Via Admin Dashboard (Recommended)
1. Log in as **Admin**
2. Go to **Admin Dashboard**
3. Click **"Users"** tab
4. Find user in the table
5. Click **"Edit"** button (pencil icon)
6. Select new role from dropdown:
   - Learner (Student)
   - Instructor (Teacher)
   - Mentor (Guide)
   - Employer (B2B)
   - Admin (Full Access)
7. Click **"Save Changes"**
8. User's role is updated immediately

#### Method 2: Via SQL (Quick)
```sql
UPDATE profiles 
SET role = 'instructor'  -- or 'learner', 'mentor', 'employer', 'admin'
WHERE email = 'user@example.com';
```

---

## 🎯 **Quick Role Comparison**

| Feature | Learner | Instructor | Mentor | Employer | Admin |
|---------|---------|------------|--------|----------|-------|
| Enroll in courses | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create courses | ❌ | ✅ | ❌ | ✅* | ✅ |
| Edit own courses | ❌ | ✅ | ❌ | ✅* | ✅ |
| Edit any course | ❌ | ❌ | ❌ | ❌ | ✅ |
| View student progress | Own | Own courses | Assigned | Team | All |
| Change user roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage organization | ❌ | ❌ | ❌ | ✅ | ✅ |

*Only for private organizational courses

---

## 🚀 **Testing Roles**

### Test Accounts Setup:
```sql
-- Make user an admin
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';

-- Make user an instructor
UPDATE profiles SET role = 'instructor' WHERE email = 'teacher@test.com';

-- Make user a learner (default)
UPDATE profiles SET role = 'learner' WHERE email = 'student@test.com';

-- Make user a mentor
UPDATE profiles SET role = 'mentor' WHERE email = 'mentor@test.com';
```

### Test Workflow:
1. **Admin**: Create users, assign roles, manage platform
2. **Instructor**: Create course with multiple lesson types
3. **Learner**: Enroll, complete lessons, track progress
4. **Mentor**: Guide assigned learner

---

## ✅ **Role Feature Checklist**

### ✅ Fixed Issues:
- ✅ Role dropdown in Admin Dashboard now shows all 5 roles
- ✅ Role values match database ('learner' not 'student')
- ✅ Role descriptions added to help admins
- ✅ Video embedding enhanced (YouTube, Vimeo, embed codes)
- ✅ Instructor can create full courses with all content types

### 🎯 Next Enhancements:
- [ ] Add role-based menu visibility
- [ ] Add instructor onboarding tutorial
- [ ] Add mentor-student assignment UI
- [ ] Add employer organization management UI
- [ ] Add admin analytics dashboard

---

**Your system is now fully role-enabled!** 🎉
