import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLearningPathStore } from '../learningPathStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

const mockLearningPath = {
  id: 'path-1',
  title: 'React Fundamentals',
  description: 'Learn the basics of React',
  target_role: 'developer',
  target_skills: ['react', 'javascript'],
  difficulty_level: 'beginner',
  estimated_duration_hours: 20,
  path_structure: { steps: [] },
  is_template: true,
  is_active: true,
  created_at: new Date().toISOString(),
};

const mockSkillGap = {
  id: 'gap-1',
  user_id: 'user-1',
  skill_id: 'skill-1',
  skill_name: 'React',
  current_level: 'beginner',
  target_level: 'intermediate',
  priority: 'high',
  recommended_courses: [],
};

describe('useLearningPathStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useLearningPathStore.setState({
      learningPaths: [],
      userLearningPaths: [],
      skillGaps: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useLearningPathStore());
      expect(result.current.learningPaths).toEqual([]);
      expect(result.current.userLearningPaths).toEqual([]);
      expect(result.current.skillGaps).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loadLearningPaths', () => {
    it('should load all learning paths', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockLearningPath], error: null }),
        });

      const { result } = renderHook(() => useLearningPathStore());

      await act(async () => {
        await result.current.loadLearningPaths();
      });

      expect(result.current.learningPaths).toEqual([mockLearningPath]);
    });
  });

  describe('createLearningPath', () => {
    it('should create a new learning path', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockLearningPath, error: null }),
        });

      const { result } = renderHook(() => useLearningPathStore());

      await act(async () => {
        await result.current.createLearningPath({
          title: 'New Path',
          description: 'New Description',
          target_role: 'developer',
          target_skills: [],
        });
      });

      expect(supabase.from).toHaveBeenCalledWith('learning_paths');
    });
  });

  describe('analyzeSkillGaps', () => {
    it('should analyze skill gaps for a user', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockSkillGap], error: null }),
        });

      const { result } = renderHook(() => useLearningPathStore());

      await act(async () => {
        await result.current.analyzeSkillGaps('user-1');
      });

      expect(result.current.skillGaps).toEqual([mockSkillGap]);
    });
  });

  describe('updateProgress', () => {
    it('should update learning path progress', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => useLearningPathStore());

      await act(async () => {
        await result.current.updateProgress('path-1', { completed_steps: 5 });
      });

      expect(supabase.from).toHaveBeenCalled();
    });
  });
});
