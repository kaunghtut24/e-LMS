import { create } from 'zustand';
import { User } from '../types';

interface UserManagementState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadUsers: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  updateUserRole: (userId: string, role: 'admin' | 'instructor' | 'student') => void;
  deleteUser: (userId: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  
  // Computed values
  getTotalUsers: () => number;
  getActiveUsers: () => number;
  getUsersByRole: (role: string) => User[];
  getSuspendedUsers: () => number;
}

export const useUserStore = create<UserManagementState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  loadUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/data/users.json');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      // Transform the data to match our User interface and add status field
      const users = data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        dateJoined: user.dateJoined,
        lastLogin: user.lastLogin,
        socialLinks: user.socialLinks,
        expertise: user.expertise,
        coursesCreated: user.coursesCreated,
        totalStudents: user.totalStudents,
        rating: user.rating,
        enrolledCourses: user.enrolledCourses,
        completedCourses: user.completedCourses,
        wishlist: user.wishlist,
        achievements: user.achievements,
        preferences: user.preferences,
        // Add status field (defaulting to active, but can be customized)
        status: user.status || (user.id === 'user-6' ? 'suspended' : 'active') // Example: user-6 is suspended
      }));
      
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Error loading users:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load users',
        isLoading: false 
      });
    }
  },

  updateUserStatus: (userId: string, status: 'active' | 'suspended') => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    }));
  },

  updateUserRole: (userId: string, role: 'admin' | 'instructor' | 'student') => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, role } : user
      )
    }));
  },

  deleteUser: (userId: string) => {
    set(state => ({
      users: state.users.filter(user => user.id !== userId)
    }));
  },

  addUser: (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`, // Simple ID generation
      status: 'active',
      dateJoined: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
    };
    
    set(state => ({
      users: [...state.users, newUser]
    }));
  },

  // Computed values
  getTotalUsers: () => {
    return get().users.length;
  },

  getActiveUsers: () => {
    return get().users.filter(user => user.status === 'active').length;
  },

  getUsersByRole: (role: string) => {
    return get().users.filter(user => user.role === role);
  },

  getSuspendedUsers: () => {
    return get().users.filter(user => user.status === 'suspended').length;
  },
}));
