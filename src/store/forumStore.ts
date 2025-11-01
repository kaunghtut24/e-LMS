import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import {
  DiscussionCategory,
  DiscussionThread,
  DiscussionPost,
  DiscussionReaction,
  DiscussionSubscription,
  CreateThreadDTO,
  UpdateThreadDTO,
  CreatePostDTO,
  UpdatePostDTO,
  CreateReactionDTO,
  ThreadFilter,
  PaginatedThreads,
  PaginatedPosts,
} from '../types/phase3-forums';

interface ForumState {
  // State
  categories: DiscussionCategory[];
  threads: DiscussionThread[];
  currentThread: DiscussionThread | null;
  posts: DiscussionPost[];
  subscriptions: DiscussionSubscription[];
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalThreads: number;
  totalPages: number;

  // Category actions
  fetchCategories: (courseId: string) => Promise<void>;
  createCategory: (data: Partial<DiscussionCategory>) => Promise<DiscussionCategory | null>;
  updateCategory: (id: string, data: Partial<DiscussionCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Thread actions
  fetchThreads: (courseId: string, filter?: ThreadFilter, page?: number) => Promise<PaginatedThreads>;
  fetchThread: (id: string) => Promise<DiscussionThread | null>;
  createThread: (data: CreateThreadDTO) => Promise<DiscussionThread | null>;
  updateThread: (id: string, data: UpdateThreadDTO) => Promise<boolean>;
  deleteThread: (id: string) => Promise<boolean>;
  incrementViews: (id: string) => Promise<void>;
  pinThread: (id: string, pinned: boolean) => Promise<boolean>;
  lockThread: (id: string, locked: boolean) => Promise<boolean>;
  closeThread: (id: string, closed: boolean) => Promise<boolean>;
  markSolved: (id: string, solved: boolean) => Promise<boolean>;

  // Post actions
  fetchPosts: (threadId: string) => Promise<void>;
  createPost: (data: CreatePostDTO) => Promise<DiscussionPost | null>;
  updatePost: (id: string, data: UpdatePostDTO) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  markSolution: (postId: string, isSolution: boolean) => Promise<boolean>;

  // Reaction actions
  addReaction: (data: CreateReactionDTO) => Promise<DiscussionReaction | null>;
  removeReaction: (postId: string, reactionType: string) => Promise<boolean>;

  // Subscription actions
  fetchSubscription: (threadId: string) => Promise<void>;
  subscribe: (threadId: string) => Promise<boolean>;
  unsubscribe: (threadId: string) => Promise<boolean>;
  updateSubscription: (threadId: string, notificationLevel: string) => Promise<boolean>;

  // Utility actions
  clearError: () => void;
  setCurrentThread: (thread: DiscussionThread | null) => void;
  setPage: (page: number) => void;
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      threads: [],
      currentThread: null,
      posts: [],
      subscriptions: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      pageSize: 20,
      totalThreads: 0,
      totalPages: 0,

      // ============================================
      // Category Actions
      // ============================================

      fetchCategories: async (courseId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('discussion_categories')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index');

          if (error) throw error;

          set({ categories: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching categories:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createCategory: async (data: Partial<DiscussionCategory>): Promise<DiscussionCategory | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: category, error } = await supabase
            .from('discussion_categories')
            .insert(data)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            categories: [...state.categories, category],
            isLoading: false,
          }));

          return category;
        } catch (error: any) {
          console.error('Error creating category:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updateCategory: async (id: string, data: Partial<DiscussionCategory>): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('discussion_categories')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? updated : c)),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating category:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteCategory: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('discussion_categories')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting category:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      // ============================================
      // Thread Actions
      // ============================================

      fetchThreads: async (courseId: string, filter?: ThreadFilter, page = 1): Promise<PaginatedThreads> => {
        set({ isLoading: true, error: null });

        try {
          const { pageSize, currentPage } = get();
          const offset = (page - 1) * pageSize;

          let query = supabase
            .from('discussion_threads')
            .select(
              `
              *,
              category:category_id(id, name, color, icon),
              creator:created_by(id, first_name, last_name, avatar_url)
            `,
              { count: 'exact' }
            )
            .eq('course_id', courseId)
            .order('is_pinned', { ascending: false })
            .order('last_activity_at', { ascending: false })
            .range(offset, offset + pageSize - 1);

          if (filter?.category_id) {
            query = query.eq('category_id', filter.category_id);
          }

          if (filter?.type) {
            query = query.eq('type', filter.type);
          }

          if (filter?.is_pinned !== undefined) {
            query = query.eq('is_pinned', filter.is_pinned);
          }

          if (filter?.is_solved !== undefined) {
            query = query.eq('is_solved', filter.is_solved);
          }

          if (filter?.search) {
            query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
          }

          const { data, error, count } = await query;

          if (error) throw error;

          const total_count = count || 0;
          const total_pages = Math.ceil(total_count / pageSize);

          set({
            threads: data || [],
            totalThreads: total_count,
            totalPages: total_pages,
            currentPage: page,
            isLoading: false,
          });

          return {
            threads: data || [],
            total_count,
            page,
            page_size: pageSize,
            total_pages,
            has_next: page < total_pages,
            has_prev: page > 1,
          };
        } catch (error: any) {
          console.error('Error fetching threads:', error);
          set({ error: error.message, isLoading: false });
          return {
            threads: [],
            total_count: 0,
            page: 1,
            page_size: 20,
            total_pages: 0,
            has_next: false,
            has_prev: false,
          };
        }
      },

      fetchThread: async (id: string): Promise<DiscussionThread | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('discussion_threads')
            .select(
              `
              *,
              category:category_id(id, name, color, icon),
              creator:created_by(id, first_name, last_name, avatar_url)
            `
            )
            .eq('id', id)
            .single();

          if (error) throw error;

          set({ currentThread: data, isLoading: false });
          return data;
        } catch (error: any) {
          console.error('Error fetching thread:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      createThread: async (data: CreateThreadDTO): Promise<DiscussionThread | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { data: thread, error } = await supabase
            .from('discussion_threads')
            .insert({
              ...data,
              created_by: profile.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            threads: [thread, ...state.threads],
            isLoading: false,
          }));

          return thread;
        } catch (error: any) {
          console.error('Error creating thread:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updateThread: async (id: string, data: UpdateThreadDTO): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('discussion_threads')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            threads: state.threads.map((t) => (t.id === id ? updated : t)),
            currentThread: state.currentThread?.id === id ? updated : state.currentThread,
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating thread:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteThread: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('discussion_threads')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            threads: state.threads.filter((t) => t.id !== id),
            currentThread: state.currentThread?.id === id ? null : state.currentThread,
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting thread:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      incrementViews: async (id: string): Promise<void> => {
        try {
          await supabase.rpc('increment_view_count', { thread_id: id });
        } catch (error) {
          console.error('Error incrementing views:', error);
        }
      },

      pinThread: async (id: string, pinned: boolean): Promise<boolean> => {
        return get().updateThread(id, { is_pinned: pinned });
      },

      lockThread: async (id: string, locked: boolean): Promise<boolean> => {
        return get().updateThread(id, { is_locked: locked });
      },

      closeThread: async (id: string, closed: boolean): Promise<boolean> => {
        return get().updateThread(id, { is_closed: closed });
      },

      markSolved: async (id: string, solved: boolean): Promise<boolean> => {
        return get().updateThread(id, { is_solved: solved });
      },

      // ============================================
      // Post Actions
      // ============================================

      fetchPosts: async (threadId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('discussion_posts')
            .select(
              `
              *,
              creator:created_by(id, first_name, last_name, avatar_url),
              reactions:discussion_reactions(*),
              attachments:discussion_attachments(*)
            `
            )
            .eq('thread_id', threadId)
            .order('created_at');

          if (error) throw error;

          set({ posts: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching posts:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createPost: async (data: CreatePostDTO): Promise<DiscussionPost | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { data: post, error } = await supabase
            .from('discussion_posts')
            .insert({
              ...data,
              created_by: profile.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            posts: [...state.posts, post],
            isLoading: false,
          }));

          return post;
        } catch (error: any) {
          console.error('Error creating post:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updatePost: async (id: string, data: UpdatePostDTO): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('discussion_posts')
            .update({
              ...data,
              is_edited: true,
              edited_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? updated : p)),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating post:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deletePost: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('discussion_posts')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting post:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      markSolution: async (postId: string, isSolution: boolean): Promise<boolean> => {
        try {
          const { error } = await supabase
            .from('discussion_posts')
            .update({ is_solution: isSolution })
            .eq('id', postId);

          if (error) throw error;

          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === postId ? { ...p, is_solution: isSolution } : p
            ),
          }));

          return true;
        } catch (error: any) {
          console.error('Error marking solution:', error);
          return false;
        }
      },

      // ============================================
      // Reaction Actions
      // ============================================

      addReaction: async (data: CreateReactionDTO): Promise<DiscussionReaction | null> => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { data: reaction, error } = await supabase
            .from('discussion_reactions')
            .insert({
              ...data,
              user_id: profile.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          // Update local state
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === data.post_id
                ? {
                    ...p,
                    reactions: [...(p.reactions || []), reaction],
                  }
                : p
            ),
          }));

          return reaction;
        } catch (error: any) {
          console.error('Error adding reaction:', error);
          return null;
        }
      },

      removeReaction: async (postId: string, reactionType: string): Promise<boolean> => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { error } = await supabase
            .from('discussion_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('reaction_type', reactionType)
            .eq('user_id', profile.user.id);

          if (error) throw error;

          // Update local state
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    reactions: (p.reactions || []).filter(
                      (r) => !(r.reaction_type === reactionType && r.user_id === profile.user.id)
                    ),
                  }
                : p
            ),
          }));

          return true;
        } catch (error: any) {
          console.error('Error removing reaction:', error);
          return false;
        }
      },

      // ============================================
      // Subscription Actions
      // ============================================

      fetchSubscription: async (threadId: string) => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) return;

          const { data, error } = await supabase
            .from('discussion_subscriptions')
            .select('*')
            .eq('thread_id', threadId)
            .eq('user_id', profile.user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          set((state) => ({
            subscriptions: [
              ...state.subscriptions.filter((s) => s.thread_id !== threadId),
              ...(data ? [data] : []),
            ],
          }));
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      },

      subscribe: async (threadId: string): Promise<boolean> => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) return false;

          const { data, error } = await supabase
            .from('discussion_subscriptions')
            .insert({
              thread_id: threadId,
              user_id: profile.user.id,
              notification_level: 'all',
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            subscriptions: [...state.subscriptions, data],
          }));

          return true;
        } catch (error) {
          console.error('Error subscribing:', error);
          return false;
        }
      },

      unsubscribe: async (threadId: string): Promise<boolean> => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) return false;

          const { error } = await supabase
            .from('discussion_subscriptions')
            .delete()
            .eq('thread_id', threadId)
            .eq('user_id', profile.user.id);

          if (error) throw error;

          set((state) => ({
            subscriptions: state.subscriptions.filter((s) => s.thread_id !== threadId),
          }));

          return true;
        } catch (error) {
          console.error('Error unsubscribing:', error);
          return false;
        }
      },

      updateSubscription: async (threadId: string, notificationLevel: string): Promise<boolean> => {
        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) return false;

          const { data, error } = await supabase
            .from('discussion_subscriptions')
            .update({ notification_level: notificationLevel })
            .eq('thread_id', threadId)
            .eq('user_id', profile.user.id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.thread_id === threadId ? data : s
            ),
          }));

          return true;
        } catch (error) {
          console.error('Error updating subscription:', error);
          return false;
        }
      },

      // ============================================
      // Utility Actions
      // ============================================

      clearError: () => {
        set({ error: null });
      },

      setCurrentThread: (thread: DiscussionThread | null) => {
        set({ currentThread: thread });
      },

      setPage: (page: number) => {
        set({ currentPage: page });
      },
    }),
    {
      name: 'forum-storage',
      partialize: (state) => ({
        // Only persist categories and subscriptions
        categories: state.categories,
        subscriptions: state.subscriptions,
      }),
    }
  )
);
