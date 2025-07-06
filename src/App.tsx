import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import { ThemeProvider } from './components/ThemeProvider';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateCoursePage from './pages/CreateCoursePage';
import CourseManagementPage from './pages/CourseManagementPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import RoleDashboardRouter from './components/RoleDashboardRouter';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { loadData } = useDataStore();

  useEffect(() => {
    // Load all data when app starts
    loadData();
  }, [loadData]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleDashboardRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseSlug/lesson/:lessonId"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />

              {/* Course Management Routes */}
              <Route
                path="/create-course"
                element={
                  <ProtectedRoute requiredRole={['instructor', 'admin']}>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-courses"
                element={
                  <ProtectedRoute requiredRole={['instructor', 'admin']}>
                    <CourseManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-course/:courseId"
                element={
                  <ProtectedRoute requiredRole={['instructor', 'admin']}>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy role-based routes - redirect to unified dashboard */}
              <Route
                path="/instructor"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/admin"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster 
            position="bottom-right" 
            expand={false}
            richColors
            closeButton
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
