// Mock Zustand stores for testing
import type { StateCreator } from 'zustand';

// Helper to create a mock store creator
export const createMockStore = <T extends object>(initialState: T) => {
  return (set: any, get: any) => ({
    ...initialState,
    set,
    get,
  });
};

// Mock authStore
export const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialize: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  updateProfile: jest.fn(),
};

// Mock dataStore
export const mockDataStore = {
  courses: [],
  currentCourse: null,
  enrollments: [],
  lessonProgress: [],
  userNotes: [],
  reviews: [],
  discussions: [],
  notifications: [],
  wishlist: [],
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,
  loadData: jest.fn(),
  loadCourses: jest.fn(),
  loadCourse: jest.fn(),
  enrollInCourse: jest.fn(),
  updateProgress: jest.fn(),
  addNote: jest.fn(),
  search: jest.fn(),
};

// Mock userStore
export const mockUserStore = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  loadUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  updateUserRole: jest.fn(),
};

// Mock portfolioStore
export const mockPortfolioStore = {
  projects: [],
  selectedProject: null,
  artifacts: [],
  isLoading: false,
  error: null,
  loadProjects: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  publishProject: jest.fn(),
};

// Mock achievementStore
export const mockAchievementStore = {
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,
  loadAchievements: jest.fn(),
  loadUserAchievements: jest.fn(),
  awardAchievement: jest.fn(),
};

// Mock learningPathStore
export const mockLearningPathStore = {
  learningPaths: [],
  userLearningPaths: [],
  skillGaps: [],
  isLoading: false,
  error: null,
  loadLearningPaths: jest.fn(),
  createLearningPath: jest.fn(),
  updateProgress: jest.fn(),
  analyzeSkillGaps: jest.fn(),
};

// Mock cmsStore
export const mockCMSStore = {
  content: {},
  isLoading: false,
  isDirty: false,
  lastSaved: null,
  loadContent: jest.fn(),
  updateContent: jest.fn(),
  saveContent: jest.fn(),
  resetContent: jest.fn(),
};
