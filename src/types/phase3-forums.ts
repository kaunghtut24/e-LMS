// ============================================
// Phase 3: Discussion Forums System Types
// ============================================

export type ThreadType = 'discussion' | 'question' | 'announcement' | 'poll' | 'assignment';
export type ReactionType = 'like' | 'upvote' | 'downvote' | 'helpful' | 'celebrate' | 'insightful' | 'agree' | 'disagree';
export type NotificationLevel = 'all' | 'replies' | 'mentions' | 'none';

// ============================================
// Core Forum Types
// ============================================

export interface DiscussionCategory {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  order_index: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  course?: Course;
  threads?: DiscussionThread[];
}

export interface DiscussionThread {
  id: string;
  category_id: string;
  course_id: string;
  created_by: string;
  title: string;
  content: string;
  type: ThreadType;
  is_pinned: boolean;
  is_locked: boolean;
  is_closed: boolean;
  is_solved: boolean;
  views_count: number;
  replies_count: number;
  participants_count: number;
  last_activity_at: string;
  last_post_at: string;
  tags?: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relations
  category?: DiscussionCategory;
  course?: Course;
  creator?: Profile;
  posts?: DiscussionPost[];
  subscription?: DiscussionSubscription;
}

export interface DiscussionPost {
  id: string;
  thread_id: string;
  parent_post_id?: string;
  created_by: string;
  content: string;
  is_edited: boolean;
  edited_at?: string;
  is_solution: boolean;
  upvotes_count: number;
  downvotes_count: number;
  replies_count: number;
  is_instructor_reply: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relations
  thread?: DiscussionThread;
  parent_post?: DiscussionPost;
  creator?: Profile;
  replies?: DiscussionPost[];
  reactions?: DiscussionReaction[];
  attachments?: DiscussionAttachment[];
  user_reaction?: DiscussionReaction;
}

export interface DiscussionReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;

  // Relations
  post?: DiscussionPost;
  user?: Profile;
}

export interface DiscussionAttachment {
  id: string;
  post_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  file_url: string;
  thumbnail_url?: string;
  created_at: string;

  // Relations
  post?: DiscussionPost;
}

export interface DiscussionSubscription {
  id: string;
  thread_id: string;
  user_id: string;
  notification_level: NotificationLevel;
  is_active: boolean;
  created_at: string;

  // Relations
  thread?: DiscussionThread;
  user?: Profile;
}

export interface DiscussionMention {
  id: string;
  post_id: string;
  mentioned_user_id: string;
  notified: boolean;
  created_at: string;

  // Relations
  post?: DiscussionPost;
  mentioned_user?: Profile;
}

// ============================================
// Extended Types with Relations
// ============================================

export interface ThreadWithDetails extends DiscussionThread {
  category: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  };
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  posts: (DiscussionPost & {
    creator: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
    reactions: DiscussionReaction[];
    user_reaction?: DiscussionReaction;
  })[];
}

export interface PostWithDetails extends DiscussionPost {
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role: string;
  };
  reactions: DiscussionReaction[];
  attachments: DiscussionAttachment[];
  replies: (DiscussionPost & {
    creator: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
    reactions: DiscussionReaction[];
  })[];
}

// ============================================
// DTO Types (for API requests/responses)
// ============================================

export interface CreateThreadDTO {
  category_id: string;
  title: string;
  content: string;
  type?: ThreadType;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateThreadDTO {
  title?: string;
  content?: string;
  type?: ThreadType;
  is_pinned?: boolean;
  is_locked?: boolean;
  is_closed?: boolean;
  is_solved?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CreatePostDTO {
  thread_id: string;
  parent_post_id?: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface UpdatePostDTO {
  content?: string;
  metadata?: Record<string, any>;
}

export interface CreateReactionDTO {
  post_id: string;
  reaction_type: ReactionType;
}

export interface CreateSubscriptionDTO {
  thread_id: string;
  notification_level?: NotificationLevel;
}

export interface UpdateSubscriptionDTO {
  notification_level?: NotificationLevel;
  is_active?: boolean;
}

// ============================================
// Form & UI Types
// ============================================

export interface ThreadFormData {
  title: string;
  content: string;
  type: ThreadType;
  tags: string[];
  category_id: string;
}

export interface PostFormData {
  content: string;
  parent_post_id?: string;
  attachments?: File[];
}

export interface ThreadFilter {
  category_id?: string;
  type?: ThreadType;
  is_pinned?: boolean;
  is_solved?: boolean;
  search?: string;
  tags?: string[];
  sort_by?: 'recent' | 'popular' | 'unanswered' | 'solved';
}

export interface PostFilter {
  thread_id?: string;
  parent_post_id?: string;
  created_by?: string;
}

// ============================================
// Statistics Types
// ============================================

export interface ThreadStats {
  thread_id: string;
  views_count: number;
  replies_count: number;
  participants_count: number;
  last_activity_at: string;
  upvotes_count: number;
  downvotes_count: number;
  reactions_count: number;
}

export interface CategoryStats {
  category_id: string;
  threads_count: number;
  posts_count: number;
  active_threads: number;
  solved_threads: number;
}

export interface UserForumStats {
  user_id: string;
  threads_created: number;
  posts_created: number;
  reactions_given: number;
  reactions_received: number;
  solutions_provided: number;
  karma_score: number;
}

// ============================================
// Notification Types
// ============================================

export interface ForumNotification {
  id: string;
  user_id: string;
  type: 'new_post' | 'new_thread' | 'mention' | 'reaction' | 'subscription';
  title: string;
  message: string;
  thread_id?: string;
  post_id?: string;
  is_read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  browser_notifications: boolean;
  notification_level: NotificationLevel;
  digest_frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

// ============================================
// Search Types
// ============================================

export interface SearchResult {
  id: string;
  type: 'thread' | 'post';
  title: string;
  content: string;
  excerpt: string;
  thread_id: string;
  thread_title: string;
  category_name: string;
  created_by: string;
  creator_name: string;
  created_at: string;
  relevance_score: number;
  highlights?: {
    title?: string;
    content?: string;
  };
}

export interface SearchFilters {
  query: string;
  category_id?: string;
  type?: ThreadType;
  date_range?: {
    from: string;
    to: string;
  };
  author_id?: string;
  has_solution?: boolean;
  sort_by?: 'relevance' | 'recent' | 'popular';
}

// ============================================
// Moderation Types
// ============================================

export interface ModerationAction {
  id: string;
  target_type: 'thread' | 'post' | 'user';
  target_id: string;
  action: 'lock' | 'unlock' | 'pin' | 'unpin' | 'close' | 'open' | 'delete' | 'hide' | 'ban';
  reason?: string;
  performed_by: string;
  performed_at: string;
  metadata?: Record<string, any>;
}

export interface ModerationQueue {
  id: string;
  type: 'flagged_post' | 'inappropriate_content' | 'spam' | 'user_report';
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  reported_by: string;
  reported_content: string;
  reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  resolution?: string;
  created_at: string;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginatedThreads {
  threads: ThreadWithDetails[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedPosts {
  posts: PostWithDetails[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// ============================================
// Utility Types
// ============================================

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  users: {
    id: string;
    name: string;
  }[];
}

export interface ThreadWithReplies extends DiscussionThread {
  first_post: DiscussionPost & {
    creator: Profile;
  };
  last_post: DiscussionPost & {
    creator: Profile;
  };
  reply_tree: DiscussionPost[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface ForumBreadcrumbs {
  course: BreadcrumbItem;
  category?: BreadcrumbItem;
  thread?: BreadcrumbItem;
}

// ============================================
// Real-time Types
// ============================================

export interface RealtimeThreadUpdate {
  type: 'new_post' | 'edit_post' | 'delete_post' | 'new_reaction' | 'thread_update';
  thread_id: string;
  post_id?: string;
  data: any;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  timestamp: string;
}

export interface TypingIndicator {
  thread_id: string;
  user_id: string;
  user_name: string;
  started_at: string;
}

// Re-export related types
export type { Course, Profile } from './enhanced';
