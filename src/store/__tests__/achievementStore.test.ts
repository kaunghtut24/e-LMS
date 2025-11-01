import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAchievementStore } from '../achievementStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

const mockAchievement = {
  id: 'achievement-1',
  name: 'First Course',
  description: 'Complete your first course',
  type: 'course_completion',
  icon: 'trophy',
  points: 100,
  rarity: 'common',
  criteria: { courses_completed: 1 },
  is_active: true,
  created_at: new Date().toISOString(),
};

const mockUserAchievement = {
  id: 'user-achievement-1',
  user_id: 'user-1',
  achievement_id: 'achievement-1',
  earned_at: new Date().toISOString(),
  progress: {},
};

describe('useAchievementStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAchievementStore.setState({
      achievements: [],
      userAchievements: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAchievementStore());
      expect(result.current.achievements).toEqual([]);
      expect(result.current.userAchievements).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loadAchievements', () => {
    it('should load all achievements', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockAchievement], error: null }),
        });

      const { result } = renderHook(() => useAchievementStore());

      await act(async () => {
        await result.current.loadAchievements();
      });

      expect(result.current.achievements).toEqual([mockAchievement]);
    });
  });

  describe('loadUserAchievements', () => {
    it('should load user achievements', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockUserAchievement], error: null }),
        });

      const { result } = renderHook(() => useAchievementStore());

      await act(async () => {
        await result.current.loadUserAchievements('user-1');
      });

      expect(result.current.userAchievements).toEqual([mockUserAchievement]);
    });
  });

  describe('awardAchievement', () => {
    it('should award an achievement to a user', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockUserAchievement, error: null }),
        });

      const { result } = renderHook(() => useAchievementStore());

      await act(async () => {
        await result.current.awardAchievement('user-1', 'achievement-1');
      });

      expect(supabase.from).toHaveBeenCalledWith('user_achievements');
    });
  });
});
