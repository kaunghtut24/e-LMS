import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateCoursePage = lazy(() => import('./pages/CreateCoursePage'));
const CourseManagementPage = lazy(() => import('./pages/CourseManagementPage'));
const CMSPage = lazy(() => import('./pages/CMSPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import RoleDashboardRouter from './components/RoleDashboardRouter';

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { loadData } = useDataStore();

  useEffect(() => {
    initialize();
    loadData();
  }, [initialize, loadData]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
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
                    path="/portfolio"
                    element={
                      <ProtectedRoute>
                        <PortfolioPage />
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

                  {/* Content Management System - Admin Only */}
                  <Route
                    path="/cms"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CMSPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Legacy role-based routes - redirect to unified dashboard */}
                  <Route path="/instructor" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

                  {/* 404 Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <Toaster position="bottom-right" expand={false} richColors closeButton />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
