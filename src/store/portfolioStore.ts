import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject, PortfolioArtifact, PortfolioProjectInsert } from '@/types/phase1-phase2';

interface PortfolioStore {
  projects: PortfolioProject[];
  selectedProject: PortfolioProject | null;
  artifacts: PortfolioArtifact[];
  isLoading: boolean;
  error: string | null;

  // Project actions
  loadProjects: (userId: string) => Promise<void>;
  loadPublicProjects: () => Promise<void>;
  createProject: (project: PortfolioProjectInsert) => Promise<PortfolioProject | null>;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  publishProject: (id: string) => Promise<void>;
  selectProject: (project: PortfolioProject | null) => void;

  // Artifact actions
  loadArtifacts: (projectId: string) => Promise<void>;
  addArtifact: (projectId: string, artifact: Omit<PortfolioArtifact, 'id' | 'created_at' | 'project_id'>) => Promise<void>;
  deleteArtifact: (artifactId: string) => Promise<void>;
  reorderArtifacts: (projectId: string, artifactIds: string[]) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  artifacts: [],
  isLoading: false,
  error: null,

  loadProjects: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading projects:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  loadPublicProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*, profiles(first_name, last_name, avatar_url)')
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      set({ projects: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading public projects:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  createProject: async (project: PortfolioProjectInsert) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([project] as any)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: [data, ...state.projects],
        isLoading: false,
      }));

      return data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateProject: async (id: string, updates: Partial<PortfolioProject>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(p => p.id === id ? data : p),
        selectedProject: state.selectedProject?.id === id ? data : state.selectedProject,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating project:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting project:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  publishProject: async (id: string) => {
    await get().updateProject(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
  },

  selectProject: (project: PortfolioProject | null) => {
    set({ selectedProject: project });
  },

  loadArtifacts: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('portfolio_artifacts')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      set({ artifacts: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading artifacts:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  addArtifact: async (projectId: string, artifact) => {
    set({ isLoading: true, error: null });
    try {
      // Get current max order_index
      const { data: existing } = await supabase
        .from('portfolio_artifacts')
        .select('order_index')
        .eq('project_id', projectId)
        .order('order_index', { ascending: false })
        .limit(1);

      const maxOrder = existing?.[0]?.order_index ?? -1;

      const { data, error } = await supabase
        .from('portfolio_artifacts')
        .insert([{
          project_id: projectId,
          ...artifact,
          order_index: maxOrder + 1,
        }] as any)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        artifacts: [...state.artifacts, data],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error adding artifact:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteArtifact: async (artifactId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('portfolio_artifacts')
        .delete()
        .eq('id', artifactId);

      if (error) throw error;

      set(state => ({
        artifacts: state.artifacts.filter(a => a.id !== artifactId),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting artifact:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  reorderArtifacts: async (projectId: string, artifactIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      // Update order_index for each artifact
      const updates = artifactIds.map((id, index) =>
        supabase
          .from('portfolio_artifacts')
          .update({ order_index: index } as any)
          .eq('id', id)
      );

      await Promise.all(updates);

      // Reload artifacts
      await get().loadArtifacts(projectId);
    } catch (error: any) {
      console.error('Error reordering artifacts:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
