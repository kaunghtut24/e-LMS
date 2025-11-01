import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolioStore } from '../portfolioStore';
import type { PortfolioProject, PortfolioArtifact } from '@/types/phase1-phase2';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
    then: vi.fn(),
  },
}));

const mockProject: PortfolioProject = {
  id: 'project-1',
  user_id: 'user-1',
  title: 'Test Project',
  description: 'Test Description',
  course_id: null,
  assignment_id: null,
  skills: ['react', 'typescript'],
  artifacts: [],
  status: 'published',
  visibility: 'public',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published_at: new Date().toISOString(),
};

const mockArtifact: PortfolioArtifact = {
  id: 'artifact-1',
  project_id: 'project-1',
  type: 'image',
  title: 'Screenshot',
  url: 'https://example.com/image.png',
  thumbnail_url: 'https://example.com/thumb.png',
  description: 'Project screenshot',
  order_index: 1,
  created_at: new Date().toISOString(),
};

describe('usePortfolioStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    usePortfolioStore.setState({
      projects: [],
      selectedProject: null,
      artifacts: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePortfolioStore());
      expect(result.current.projects).toEqual([]);
      expect(result.current.selectedProject).toBeNull();
      expect(result.current.artifacts).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loadProjects', () => {
    it('should load projects for a user', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockProject], error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.loadProjects('user-1');
      });

      expect(result.current.projects).toEqual([mockProject]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loadProjects error', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: null, error: { message: 'Error' } }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.loadProjects('user-1');
      });

      expect(result.current.error).toBe('Error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadPublicProjects', () => {
    it('should load public projects', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockProject], error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.loadPublicProjects();
      });

      expect(result.current.projects).toEqual([mockProject]);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      let createdProject: PortfolioProject | null;
      await act(async () => {
        createdProject = await result.current.createProject({
          user_id: 'user-1',
          title: 'Test Project',
          description: 'Test Description',
          skills: ['react'],
          status: 'draft',
          visibility: 'private',
        });
      });

      expect(createdProject).toEqual(mockProject);
    });

    it('should handle createProject error', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.createProject({
          user_id: 'user-1',
          title: 'Test Project',
          description: 'Test Description',
          skills: ['react'],
          status: 'draft',
          visibility: 'private',
        });
      });

      expect(result.current.error).toBe('Error');
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      // Set initial state
      usePortfolioStore.setState({ projects: [mockProject] });

      const updates = { title: 'Updated Title' };

      await act(async () => {
        await result.current.updateProject('project-1', updates);
      });

      // The update should have been called
      expect(supabase.from).toHaveBeenCalledWith('portfolio_projects');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      // Set initial state with project
      usePortfolioStore.setState({ projects: [mockProject] });

      await act(async () => {
        await result.current.deleteProject('project-1');
      });

      expect(supabase.from).toHaveBeenCalledWith('portfolio_projects');
    });
  });

  describe('publishProject', () => {
    it('should publish a project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.publishProject('project-1');
      });

      expect(supabase.from).toHaveBeenCalledWith('portfolio_projects');
    });
  });

  describe('selectProject', () => {
    it('should select a project', () => {
      const { result } = renderHook(() => usePortfolioStore());

      act(() => {
        result.current.selectProject(mockProject);
      });

      expect(result.current.selectedProject).toEqual(mockProject);
    });

    it('should deselect when null is passed', () => {
      const { result } = renderHook(() => usePortfolioStore());

      // First select a project
      act(() => {
        result.current.selectProject(mockProject);
      });

      expect(result.current.selectedProject).toEqual(mockProject);

      // Then deselect
      act(() => {
        result.current.selectProject(null);
      });

      expect(result.current.selectedProject).toBeNull();
    });
  });

  describe('loadArtifacts', () => {
    it('should load artifacts for a project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ data: [mockArtifact], error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.loadArtifacts('project-1');
      });

      expect(result.current.artifacts).toEqual([mockArtifact]);
    });
  });

  describe('addArtifact', () => {
    it('should add an artifact to a project', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockArtifact, error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.addArtifact('project-1', {
          type: 'image',
          title: 'Screenshot',
          url: 'https://example.com/image.png',
          order_index: 1,
        });
      });

      expect(supabase.from).toHaveBeenCalledWith('portfolio_artifacts');
    });
  });

  describe('deleteArtifact', () => {
    it('should delete an artifact', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.deleteArtifact('artifact-1');
      });

      expect(supabase.from).toHaveBeenCalledWith('portfolio_artifacts');
    });
  });

  describe('reorderArtifacts', () => {
    it('should reorder artifacts', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.from as vi.MockedFunction<any>)
        .mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: any) => resolve({ error: null }),
        });

      const { result } = renderHook(() => usePortfolioStore());

      await act(async () => {
        await result.current.reorderArtifacts('project-1', ['artifact-2', 'artifact-1']);
      });

      // Should update order for each artifact
      expect(supabase.from).toHaveBeenCalledTimes(2);
    });
  });
});
