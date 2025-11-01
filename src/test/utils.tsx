import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';

// Test wrapper that includes all providers
function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
}

// Custom render function that includes all providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// Helper to create a mock user
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'learner' as const,
  first_name: 'Test',
  last_name: 'User',
  avatar_url: null,
  ...overrides,
});

// Helper to create a mock course
export const createMockCourse = (overrides = {}) => ({
  id: 'test-course-id',
  title: 'Test Course',
  description: 'Test Description',
  instructor_id: 'test-instructor-id',
  category_id: 'test-category-id',
  price: 99,
  thumbnail_url: null,
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock data
export const createMockStore = {
  authStore: {
    user: createMockUser(),
    isAuthenticated: true,
    isLoading: false,
    error: null,
    initialize: () => {},
    login: () => {},
    logout: () => {},
    register: () => {},
    updateProfile: () => {},
  },
  dataStore: {
    courses: [],
    currentCourse: null,
    enrollments: [],
    isLoading: false,
    error: null,
    loadData: () => {},
    enrollInCourse: () => {},
    updateProgress: () => {},
  },
};
