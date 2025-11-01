import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Achievement, UserAchievement } from '@/types/phase1-phase2';

interface AchievementStore {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAchievements: () => Promise<void>;
  loadUserAchievements: (userId: string) => Promise<void>;
  checkAndAwardAchievements: (userId: string) => Promise<void>;
  hasAchievement: (achievementSlug: string) => boolean;
  getProgress: (achievementSlug: string) => number;
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,

  loadAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (error) throw error;
      set({ achievements: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading achievements:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  loadUserAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      set({ userAchievements: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error loading user achievements:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  checkAndAwardAchievements: async (userId: string) => {
    try {
      const { achievements } = get();

      // Get user stats
      const [
        { count: lessonsCompleted },
        { count: coursesCompleted },
        { count: projectsSubmitted },
      ] = await Promise.all([
        supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed'),
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }).eq('user_id', userId).neq('status', 'draft'),
      ]);

      // Check each achievement
      for (const achievement of achievements) {
        const criteria = achievement.criteria as any;

        let shouldAward = false;

        switch (achievement.type) {
          case 'course_completion':
            if (criteria.lessons_completed && lessonsCompleted && lessonsCompleted >= criteria.lessons_completed) {
              shouldAward = true;
            }
            if (criteria.courses_completed && coursesCompleted && coursesCompleted >= criteria.courses_completed) {
              shouldAward = true;
            }
            break;

          case 'project_submission':
            if (criteria.projects_submitted && projectsSubmitted && projectsSubmitted >= criteria.projects_submitted) {
              shouldAward = true;
            }
            break;

          case 'skill_mastery':
            // Check if user has mastered a skill
            const { count: masteredSkills } = await supabase
              .from('user_skills')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('current_level', 'expert');

            if (criteria.skills_mastered && masteredSkills && masteredSkills >= criteria.skills_mastered) {
              shouldAward = true;
            }
            break;
        }

        if (shouldAward) {
          // Check if user already has this achievement
          const { data: existing } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .single();

          if (!existing) {
            // Award achievement
            await supabase
              .from('user_achievements')
              .insert([{
                user_id: userId,
                achievement_id: achievement.id,
              }] as any);

            console.log(`🏆 Awarded achievement: ${achievement.name}`);
          }
        }
      }

      // Reload user achievements
      await get().loadUserAchievements(userId);
    } catch (error: any) {
      console.error('Error checking achievements:', error);
    }
  },

  hasAchievement: (achievementSlug: string) => {
    const { userAchievements } = get();
    return userAchievements.some(ua => 
      (ua.achievement as Achievement)?.slug === achievementSlug
    );
  },

  getProgress: (achievementSlug: string) => {
    const { userAchievements } = get();
    const userAchievement = userAchievements.find(ua => 
      (ua.achievement as Achievement)?.slug === achievementSlug
    );
    return userAchievement?.progress?.percentage || 0;
  },
}));
