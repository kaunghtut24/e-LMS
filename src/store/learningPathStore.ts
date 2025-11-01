import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { LearningPath, UserLearningPath, SkillGap } from '@/types/phase1-phase2';

interface LearningPathStore {
  paths: LearningPath[];
  userPaths: UserLearningPath[];
  currentPath: UserLearningPath | null;
  skillGaps: SkillGap[];
  isLoading: boolean;
  error: string | null;

  // Learning Path actions
  loadLearningPaths: () => Promise<void>;
  loadUserPaths: (userId: string) => Promise<void>;
  startLearningPath: (userId: string, pathId: string) => Promise<void>;
  updateProgress: (userPathId: string, stepCompleted: number) => Promise<void>;
  pausePath: (userPathId: string) => Promise<void>;
  resumePath: (userPathId: string) => Promise<void>;
  completePath: (userPathId: string) => Promise<void>;

  // Skill Gap actions
  loadSkillGaps: (userId: string) => Promise<void>;
  analyzeSkillGaps: (userId: string, targetRole?: string) => Promise<void>;
  updateGapStatus: (gapId: string, status: SkillGap['status']) => Promise<void>;
}

export const useLearningPathStore = create<LearningPathStore>((set, get) => ({
  paths: [],
  userPaths: [],
  currentPath: null,
  skillGaps: [],
  isLoading: false,
  error: null,

  loadLearningPaths: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_active', true)
        .eq('is_template', true)
        .order('difficulty_level', { ascending: true });

      if (error) throw error;
      set({ paths: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading learning paths:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  loadUserPaths: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_learning_paths')
        .select('*, learning_paths(*)')
        .eq('user_id', userId)
        .order('last_accessed_at', { ascending: false });

      if (error) throw error;
      set({ 
        userPaths: data || [], 
        currentPath: data?.find(p => p.status === 'active') || null,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error loading user paths:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  startLearningPath: async (userId: string, pathId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get the learning path
      const { data: path, error: pathError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single();

      if (pathError || !path) throw pathError || new Error('Path not found');

      const pathStructure = (path.path_structure || []) as any[];
      const totalSteps = pathStructure.length;

      // Create user learning path
      const { data, error } = await supabase
        .from('user_learning_paths')
        .insert([{
          user_id: userId,
          learning_path_id: pathId,
          status: 'active',
          progress_percentage: 0,
          current_step: 0,
          total_steps: totalSteps,
        }] as any)
        .select('*, learning_paths(*)')
        .single();

      if (error) throw error;

      set(state => ({
        userPaths: [data, ...state.userPaths],
        currentPath: data,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error starting learning path:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProgress: async (userPathId: string, stepCompleted: number) => {
    set({ isLoading: true, error: null });
    try {
      // Get current path
      const { data: currentPath } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('id', userPathId)
        .single();

      if (!currentPath) throw new Error('Path not found');

      const newProgress = Math.round((stepCompleted / currentPath.total_steps) * 100);
      const isCompleted = stepCompleted >= currentPath.total_steps;

      const { data, error } = await supabase
        .from('user_learning_paths')
        .update({
          current_step: stepCompleted,
          progress_percentage: newProgress,
          status: isCompleted ? 'completed' : 'active',
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
        } as any)
        .eq('id', userPathId)
        .select('*, learning_paths(*)')
        .single();

      if (error) throw error;

      set(state => ({
        userPaths: state.userPaths.map(p => p.id === userPathId ? data : p),
        currentPath: state.currentPath?.id === userPathId ? data : state.currentPath,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating progress:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  pausePath: async (userPathId: string) => {
    try {
      const { error } = await supabase
        .from('user_learning_paths')
        .update({ status: 'paused' } as any)
        .eq('id', userPathId);
      if (error) throw error;
    } catch (error: any) {
      console.error('Error pausing path:', error);
    }
  },

  resumePath: async (userPathId: string) => {
    try {
      const { error } = await supabase
        .from('user_learning_paths')
        .update({ status: 'active' } as any)
        .eq('id', userPathId);
      if (error) throw error;
    } catch (error: any) {
      console.error('Error resuming path:', error);
    }
  },

  completePath: async (userPathId: string) => {
    try {
      const { error } = await supabase
        .from('user_learning_paths')
        .update({ status: 'completed' } as any)
        .eq('id', userPathId);
      if (error) throw error;
    } catch (error: any) {
      console.error('Error completing path:', error);
    }
  },

  loadSkillGaps: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('skill_gaps')
        .select('*, skills(*)')
        .eq('user_id', userId)
        .neq('status', 'obsolete')
        .order('priority', { ascending: false });

      if (error) throw error;
      set({ skillGaps: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading skill gaps:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  analyzeSkillGaps: async (userId: string, targetRole?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get user's current skills
      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('skill_id, current_level')
        .eq('user_id', userId);

      // Get target skills for role (if specified)
      let targetSkills: string[] = [];
      if (targetRole) {
        const { data: paths } = await supabase
          .from('learning_paths')
          .select('target_skills')
          .eq('target_role', targetRole)
          .single();

        targetSkills = paths?.target_skills || [];
      }

      // Identify gaps
      const gaps: any[] = [];
      for (const targetSkill of targetSkills) {
        const userSkill = userSkills?.find(us => us.skill_id === targetSkill);
        const currentLevel = userSkill?.current_level || 'none';

        if (currentLevel !== 'expert') {
          // Calculate gap size
          const levelMap: Record<string, number> = {
            none: 0,
            beginner: 1,
            intermediate: 2,
            advanced: 3,
            expert: 4,
          };

          const currentVal = levelMap[currentLevel];
          const targetVal = levelMap['advanced']; // Default target
          const gapDiff = targetVal - currentVal;

          let gapSize: 'small' | 'medium' | 'large' = 'medium';
          if (gapDiff <= 1) gapSize = 'small';
          else if (gapDiff >= 3) gapSize = 'large';

          gaps.push({
            user_id: userId,
            skill_id: targetSkill,
            current_level: currentLevel,
            target_level: 'advanced',
            gap_size: gapSize,
            priority: gapSize === 'large' ? 'high' : 'medium',
            status: 'identified',
            identified_by: 'system_analysis',
          });
        }
      }

      // Insert gaps
      if (gaps.length > 0) {
        await supabase
          .from('skill_gaps')
          .upsert(gaps as any, { onConflict: 'user_id,skill_id' });
      }

      // Reload gaps
      await get().loadSkillGaps(userId);
    } catch (error: any) {
      console.error('Error analyzing skill gaps:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateGapStatus: async (gapId: string, status: SkillGap['status']) => {
    set({ isLoading: true, error: null });
    try {
      const updates: any = { status };
      if (status === 'closed') {
        updates.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('skill_gaps')
        .update(updates)
        .eq('id', gapId);

      if (error) throw error;

      set(state => ({
        skillGaps: state.skillGaps.map(g => 
          g.id === gapId ? { ...g, ...updates } : g
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating gap status:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
