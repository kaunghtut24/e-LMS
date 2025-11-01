import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardPage from '../pages/DashboardPage';
import InstructorDashboard from '../pages/InstructorDashboard';
import AdminDashboard from '../pages/AdminDashboard';

/**
 * RoleDashboardRouter - Routes users to their appropriate dashboard based on role
 * This component ensures each user type sees their role-specific dashboard
 */
const RoleDashboardRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'learner':
    case 'mentor':
    case 'employer':
      return <DashboardPage />;
    default:
      // Fallback for unknown roles
      return <Navigate to="/" replace />;
  }
};

export default RoleDashboardRouter;
