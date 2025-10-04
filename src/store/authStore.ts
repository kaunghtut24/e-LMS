import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Profile, ProfileInsert } from '../types/enhanced';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthState {
  user: Profile | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (userData: Partial<Profile>) => Promise<boolean>;
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'learner' | 'instructor' | 'mentor' | 'employer';
  accountType?: 'b2c' | 'b2b';
  organizationId?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      isLoading: false,

      initialize: async () => {
        set({ isLoading: true });

        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              set({
                user: profile,
                supabaseUser: session.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Initialize error:', error);
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { supabaseUser } = get();
        if (!supabaseUser) return;

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          if (error) throw error;

          if (profile) {
            set({ user: profile });
          }
        } catch (error) {
          console.error('Fetch profile error:', error);
        }
      },

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile) {
              await supabase
                .from('profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('id', data.user.id);

              set({
                user: { ...profile, last_login: new Date().toISOString() },
                supabaseUser: data.user,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            supabaseUser: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      register: async (userData: RegisterData): Promise<boolean> => {
        set({ isLoading: true });

        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
          });

          if (authError) throw authError;

          if (authData.user) {
            const profileData: ProfileInsert = {
              id: authData.user.id,
              email: userData.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              role: userData.role || 'learner',
              account_type: userData.accountType || 'b2c',
              organization_id: userData.organizationId || null,
              bio: '',
              avatar_url: null,
              social_links: {},
              expertise: [],
              preferences: {
                theme: 'light',
                language: 'en',
                notifications: {
                  email: true,
                  browser: true,
                },
              },
              status: 'active',
              onboarding_completed: false,
              timezone: 'UTC',
              language: 'en',
            };

            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .insert(profileData)
              .select()
              .single();

            if (profileError) throw profileError;

            set({
              user: profile,
              supabaseUser: authData.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      updateProfile: async (userData: Partial<Profile>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          set({ user: data });
          return true;
        } catch (error) {
          console.error('Update profile error:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

supabase.auth.onAuthStateChange((event, session) => {
  (async () => {
    const store = useAuthStore.getState();

    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        store.user = profile;
        store.supabaseUser = session.user;
        store.isAuthenticated = true;
      }
    } else if (event === 'SIGNED_OUT') {
      store.user = null;
      store.supabaseUser = null;
      store.isAuthenticated = false;
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      store.supabaseUser = session.user;
    }
  })();
});
