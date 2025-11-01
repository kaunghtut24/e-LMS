import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import type { Profile } from '@/types/enhanced';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  },
}));

// Mock the types
const mockProfile: Profile = {
  id: 'user-id-1',
  email: 'test@example.com',
  role: 'learner',
  account_type: 'b2c',
  organization_id: null,
  first_name: 'Test',
  last_name: 'User',
  avatar_url: null,
  bio: 'Test bio',
  timezone: 'UTC',
  language: 'en',
  social_links: {},
  expertise: [],
  preferences: {},
  status: 'active',
  onboarding_completed: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
};

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.user).toBeNull();
      expect(result.current.supabaseUser).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should set loading state during initialization', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as vi.MockedFunction<any>).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should authenticate user if session exists', async () => {
      const { supabase } = await import('@/lib/supabase');
      const mockSession = {
        user: { id: 'user-id-1', email: 'test@example.com' },
      };

      (supabase.auth.getSession as vi.MockedFunction<any>).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockProfile);
      expect(result.current.supabaseUser).toEqual(mockSession.user);
    });

    it('should handle initialization error', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as vi.MockedFunction<any>).mockRejectedValue(
        new Error('Auth error')
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('fetchProfile', () => {
    it('should fetch profile when supabaseUser exists', async () => {
      const { supabase } = await import('@/lib/supabase');
      const mockUser = { id: 'user-id-1', email: 'test@example.com' };

      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        });

      const { result } = renderHook(() => useAuthStore());

      // Set supabaseUser manually
      useAuthStore.setState({ supabaseUser: mockUser });

      await act(async () => {
        await result.current.fetchProfile();
      });

      expect(result.current.user).toEqual(mockProfile);
    });

    it('should not fetch profile when supabaseUser is null', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>).mockClear();

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchProfile();
      });

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.signInWithPassword as vi.MockedFunction<any>).mockResolvedValue({
        data: {
          user: { id: 'user-id-1', email: 'test@example.com' },
          session: {
            user: { id: 'user-id-1', email: 'test@example.com' },
          },
        },
        error: null,
      });

      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        });

      const { result } = renderHook(() => useAuthStore());

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123');
      });

      expect(loginResult).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockProfile);
    });

    it('should fail login with invalid credentials', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.signInWithPassword as vi.MockedFunction<any>).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      const { result } = renderHook(() => useAuthStore());

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpassword');
      });

      expect(loginResult).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.signOut as vi.MockedFunction<any>).mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      useAuthStore.setState({
        user: mockProfile,
        supabaseUser: { id: 'user-id-1' } as any,
        isAuthenticated: true,
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.supabaseUser).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.signUp as vi.MockedFunction<any>).mockResolvedValue({
        data: {
          user: { id: 'user-id-1', email: 'test@example.com' },
        },
        error: null,
      });

      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        });

      const { result } = renderHook(() => useAuthStore());

      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'learner' as const,
      };

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.register(registerData);
      });

      expect(registerResult).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('should successfully update profile', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        });

      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      useAuthStore.setState({
        user: mockProfile,
        isAuthenticated: true,
      });

      const updates = { first_name: 'Updated' };

      let updateResult: boolean;
      await act(async () => {
        updateResult = await result.current.updateProfile(updates);
      });

      expect(updateResult).toBe(true);
      expect(result.current.user?.first_name).toBe('Updated');
    });
  });
});
