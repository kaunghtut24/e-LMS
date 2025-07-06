import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Fetch users data
          const response = await fetch('/data/users.json');
          const data = await response.json();
          
          // Find user with matching credentials
          const user = data.users.find((u: User) => 
            u.email === email && u.password === password
          );
          
          if (user) {
            // Remove password from user object before storing
            const { password: _, ...userWithoutPassword } = user;
            set({ 
              user: userWithoutPassword as User, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (userData: Partial<User>): Promise<boolean> => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would create a new user in the database
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email || '',
            role: 'student',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatar: '/images/avatars/default.jpg',
            bio: userData.bio || '',
            dateJoined: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            enrolledCourses: [],
            completedCourses: [],
            wishlist: [],
            achievements: [],
            preferences: {
              theme: 'light',
              language: 'en',
              notifications: {
                email: true,
                browser: true,
                mobile: true
              }
            }
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      updateProfile: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
