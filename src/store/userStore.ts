import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/enhanced';
import type { User } from '../types';

interface UserManagementState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadUsers: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
  updateUserRole: (userId: string, role: 'admin' | 'instructor' | 'student' | 'learner' | 'mentor' | 'employer') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  
  // Computed values
  getTotalUsers: () => number;
  getActiveUsers: () => number;
  getUsersByRole: (role: string) => User[];
  getSuspendedUsers: () => number;
}

// Helper function to map Profile to User
const mapProfileToUser = (profile: Profile): User => {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role === 'learner' ? 'student' : 
          profile.role === 'admin' ? 'admin' : 'instructor',
    status: profile.status === 'active' ? 'active' : 'suspended',
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: profile.avatar_url || '/default-avatar.jpg',
    bio: profile.bio,
    dateJoined: profile.created_at.split('T')[0],
    lastLogin: profile.last_login,
    socialLinks: (profile.social_links as any) || {},
    expertise: profile.expertise || [],
    coursesCreated: 0,
    totalStudents: 0,
    rating: 0,
    enrolledCourses: [],
    completedCourses: [],
    wishlist: [],
    achievements: [],
    preferences: {
      theme: ((profile.preferences as any)?.theme || 'light') as 'light' | 'dark',
      language: (profile.preferences as any)?.language || profile.language || 'en',
      notifications: {
        email: (profile.preferences as any)?.notifications?.email ?? true,
        browser: (profile.preferences as any)?.notifications?.browser ?? true,
        mobile: false,
      }
    }
  };
};

export const useUserStore = create<UserManagementState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  loadUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const users = (profilesData || []).map(mapProfileToUser);
      
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Error loading users:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load users',
        isLoading: false 
      });
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: status === 'active' ? 'active' : 'suspended' } as any)
        .eq('id', userId);

      if (error) throw error;

      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      }));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  },

  updateUserRole: async (userId: string, role: 'admin' | 'instructor' | 'student' | 'learner' | 'mentor' | 'employer') => {
    try {
      // Map UI role to DB role (UI uses both 'student' and 'learner', DB only uses 'learner')
      const dbRole = role === 'student' ? 'learner' : role;
      
      console.log('Attempting role update:', { userId, requestedRole: role, dbRole });
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: dbRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating user role:', error);
        throw error;
      }

      console.log('Supabase update response:', data);

      if (!data || data.length === 0) {
        console.warn('Update succeeded but no data returned. This might indicate RLS policy issue.');
      }

      // Update local state
      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, role: role === 'student' ? 'student' : role as any } : user
        )
      }));

      console.log('Role updated successfully:', { userId, newRole: dbRole });
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      set(state => ({
        users: state.users.filter(user => user.id !== userId)
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  },

  addUser: async (userData: Omit<User, 'id'>) => {
    try {
      // Note: In a real app, this would create an auth user first
      // For now, we'll just insert into profiles (requires auth trigger)
      console.warn('Adding user directly to profiles requires auth setup');
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        status: 'active',
        dateJoined: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
      };
      
      set(state => ({
        users: [...state.users, newUser]
      }));
    } catch (error) {
      console.error('Failed to add user:', error);
    }
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
