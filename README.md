# EduLearn - Modern E-Learning Management System

A comprehensive, production-ready e-learning platform built with React, TypeScript, and Tailwind CSS. This full-featured LMS includes user management, course delivery, interactive learning tools, and administrative features.

## 🚀 Live Demo

**[Access EduLearn Platform](https://dwbhqe3o9v.space.minimax.io)**

### Demo Credentials
Test the platform with these demo accounts:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| Admin | admin@elms.com | admin123 | Full administrative access |
| Instructor | instructor1@elms.com | instructor123 | Course creation and management |
| Student | student1@elms.com | student123 | Course enrollment and learning |

## ✨ Key Features

### 🎯 Core Platform Features
- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **User Authentication**: JWT-based auth with role-based access control
- **Three User Roles**: Admin, Instructor, and Student with specific permissions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Real-time Search**: Advanced course search and filtering capabilities

### 📚 Learning Management
- **Course Catalog**: Browse 500+ courses across multiple categories
- **Advanced Filtering**: Filter by category, level, duration, price, and rating
- **Progress Tracking**: Visual progress bars and completion tracking
- **Bookmarking**: Save lessons and courses for later access
- **Note-taking**: Built-in note-taking tool for lessons
- **Certificates**: Auto-generated completion certificates

### 🎨 User Experience
- **Modern Design**: Professional, clean interface with intuitive navigation
- **Interactive Elements**: Hover effects, smooth transitions, loading states
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Theme Support**: Light/dark/system theme preferences
- **Toast Notifications**: Real-time feedback for user actions

### 📊 Course Management
- **Rich Course Content**: Video lessons, quizzes, assignments, and resources
- **Multiple Course Formats**: Video, text, interactive quizzes
- **Instructor Profiles**: Detailed instructor information and ratings
- **Course Reviews**: Student reviews and ratings system
- **Course Categories**: Organized taxonomy with subcategories

### 💬 Social & Communication
- **Discussion Forums**: Threaded discussions per lesson/course
- **Messaging System**: Private messaging between users
- **Notifications**: Real-time notifications for platform activities
- **Community Features**: Student and instructor interaction tools

## 🛠️ Technical Stack

### Frontend
- **React 18.3** - Modern React with hooks and functional components
- **TypeScript 5.6** - Type-safe development experience
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Vite 6.0** - Fast build tool and development server
- **React Router 6** - Client-side routing
- **Zustand 4.5** - Lightweight state management

### UI Components
- **Radix UI** - Headless, accessible component primitives
- **Lucide React** - Beautiful SVG icon library
- **Sonner** - Toast notification system
- **React Hook Form** - Form handling with validation

### Development Tools
- **ESLint 9.15** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
modern-elms/
├── public/
│   ├── data/                    # Mock data (JSON files)
│   │   ├── users.json          # User accounts and profiles
│   │   ├── courses.json        # Course catalog and metadata
│   │   ├── lessons.json        # Lesson content and progress
│   │   ├── reviews.json        # Course reviews and ratings
│   │   └── discussions.json    # Forum discussions and messages
│   └── images/                 # Static assets
│       ├── courses/            # Course thumbnails
│       └── avatars/            # User profile images
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Base UI components (Radix UI)
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   ├── ThemeProvider.tsx  # Theme management
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── pages/                 # Page components
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── CoursesPage.tsx    # Course catalog
│   │   ├── LoginPage.tsx      # Authentication
│   │   ├── DashboardPage.tsx  # User dashboard
│   │   └── ...                # Other pages
│   ├── store/                 # State management
│   │   ├── authStore.ts       # Authentication state
│   │   └── dataStore.ts       # Application data
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # All type interfaces
│   └── App.tsx                # Main application component
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd modern-elms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

5. **Preview production build**
   ```bash
   pnpm preview
   ```

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Neutral grays for content
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter, semibold/bold weights
- **Body**: Inter, regular/medium weights
- **Code**: JetBrains Mono (monospace)

### Components
- Consistent spacing using Tailwind's scale
- Rounded corners (0.5rem radius)
- Subtle shadows and hover effects
- Accessible color contrasts

## 📊 Features Breakdown

### Authentication System
- Secure login/logout functionality
- Role-based access control (Admin/Instructor/Student)
- Password validation and security
- Demo accounts for testing

### Course Management
- **8 Featured Courses** across 4 categories:
  - Web Development (React, Node.js, Full-Stack)
  - Programming (JavaScript, Python)
  - Design (UI/UX, Figma)
  - Data Science (Machine Learning)

### User Roles & Permissions

#### Students
- Browse and search courses
- Enroll in courses
- Track learning progress
- Take notes and bookmark lessons
- Participate in discussions
- View certificates

#### Instructors
- Create and manage courses
- View student analytics
- Moderate discussions
- Communicate with students

#### Administrators
- Manage all users and courses
- Platform analytics
- Content moderation
- System settings

## 🔧 Configuration

### Environment Variables
No environment variables required for basic setup. All data is served from static JSON files in the `public/data/` directory.

### Customization
- **Theme**: Modify `src/components/ThemeProvider.tsx`
- **Colors**: Update `tailwind.config.js`
- **Mock Data**: Edit JSON files in `public/data/`

## 🧪 Testing

The platform has been thoroughly tested with:
- **Authentication flow**: Login/logout with all user roles
- **Navigation**: All routes and page transitions
- **Search & Filtering**: Course discovery functionality
- **Responsive Design**: Mobile and desktop layouts
- **User Interface**: Interactive elements and feedback

### Browser Testing
Tested and verified on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized navigation
- Progressive Web App (PWA) ready

## 🚀 Deployment

### Build Process
```bash
pnpm build
```

Creates optimized production build in `dist/` directory.

### Deployment Options
- Static hosting (Vercel, Netlify, GitHub Pages)
- CDN deployment
- Traditional web servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern e-learning platforms
- **UI Components**: Radix UI and shadcn/ui
- **Icons**: Lucide React
- **Course Content**: Inspired by real online courses

## 📞 Support

For questions, issues, or feature requests:
- Email: contact@edulearn.com
- GitHub Issues: [Create an issue](repository-url/issues)

---

**Built with ❤️ using modern web technologies**

*EduLearn - Empowering learners worldwide with accessible, high-quality online education.*
