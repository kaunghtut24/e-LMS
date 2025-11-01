import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCMSStore } from '../cmsStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

const mockContent = {
  homePage: {
    hero: {
      title: 'Welcome',
      subtitle: 'Subtitle',
    },
  },
  lastUpdated: new Date().toISOString(),
  version: '1.0',
};

describe('useCMSStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCMSStore.setState({
      content: {},
      isLoading: false,
      isDirty: false,
      lastSaved: null,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCMSStore());
      expect(result.current.content).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isDirty).toBe(false);
      expect(result.current.lastSaved).toBeNull();
    });
  });

  describe('loadContent', () => {
    it('should load CMS content', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: mockContent, error: null }),
        });

      const { result } = renderHook(() => useCMSStore());

      await act(async () => {
        await result.current.loadContent();
      });

      expect(result.current.content).toEqual(mockContent);
    });
  });

  describe('updateContent', () => {
    it('should update content and mark as dirty', () => {
      const { result } = renderHook(() => useCMSStore());

      act(() => {
        result.current.updateContent('homePage', { hero: { title: 'Updated' } });
      });

      expect(result.current.content.homePage).toEqual({ hero: { title: 'Updated' } });
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('saveContent', () => {
    it('should save content', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => useCMSStore());

      useCMSStore.setState({ content: mockContent });

      await act(async () => {
        await result.current.saveContent();
      });

      expect(supabase.from).toHaveBeenCalledWith('cms_content');
    });
  });

  describe('resetContent', () => {
    it('should reset content', () => {
      const { result } = renderHook(() => useCMSStore());

      useCMSStore.setState({ content: mockContent, isDirty: true });

      act(() => {
        result.current.resetContent();
      });

      expect(result.current.content).toEqual({});
      expect(result.current.isDirty).toBe(false);
    });
  });
});
