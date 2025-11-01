import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { 
  Course as DBCourse, 
  Lesson as DBLesson, 
  Enrollment, 
  LessonProgress,
  UserNote,
  Category as DBCategory,
  Profile 
} from '../types/enhanced';
import type { 
  Course, 
  Lesson, 
  Progress, 
  Review, 
  Discussion, 
  Message, 
  Notification, 
  Category 
} from '../types';

interface DataState {
  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  reviews: Review[];
  discussions: Discussion[];
  messages: Message[];
  notifications: Notification[];
  categories: Category[];
  isLoading: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  getCoursesByCategory: (category: string) => Course[];
  getUserProgress: (userId: string, courseId: string) => Progress | undefined;
  getCourseLessons: (courseId: string) => Lesson[];
  getCourseReviews: (courseId: string) => Review[];
  getCourseDiscussions: (courseId: string) => Discussion[];
  getUserMessages: (userId: string) => Message[];
  getUserNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  addToWishlist: (userId: string, courseId: string) => Promise<void>;
  removeFromWishlist: (userId: string, courseId: string) => Promise<void>;
  enrollInCourse: (userId: string, courseId: string) => Promise<void>;
  updateProgress: (userId: string, courseId: string, lessonId: string) => Promise<void>;
  addNote: (userId: string, courseId: string, lessonId: string, content: string) => Promise<void>;
  addBookmark: (userId: string, courseId: string, lessonId: string) => Promise<void>;
  removeBookmark: (userId: string, courseId: string, lessonId: string) => Promise<void>;
  searchCourses: (query: string) => Course[];
  addCourse: (course: Partial<DBCourse>) => Promise<void>;
  updateCourse: (courseId: string, updates: Partial<DBCourse>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
}

// Helper function to map database Course to UI Course
const mapDBCourseToUI = (dbCourse: DBCourse & { instructor?: Profile }): Course => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    slug: dbCourse.slug,
    description: dbCourse.description,
    longDescription: dbCourse.long_description || dbCourse.description,
    instructorId: dbCourse.instructor_id,
    instructorName: dbCourse.instructor 
      ? `${dbCourse.instructor.first_name} ${dbCourse.instructor.last_name}`
      : 'Unknown Instructor',
    category: dbCourse.category_id || 'General',
    subCategory: '',
    level: dbCourse.level.charAt(0).toUpperCase() + dbCourse.level.slice(1) as 'Beginner' | 'Intermediate' | 'Advanced',
    price: dbCourse.price,
    originalPrice: dbCourse.price * 1.3,
    currency: dbCourse.currency,
    thumbnail: dbCourse.thumbnail_url || '/placeholder-course.jpg',
    videoPreview: dbCourse.video_preview_url || undefined,
    duration: `${dbCourse.duration_hours}h`,
    totalLessons: 0,
    totalStudents: 0,
    rating: 0,
    totalReviews: 0,
    language: dbCourse.language,
    subtitles: [dbCourse.language],
    tags: dbCourse.tags || [],
    requirements: dbCourse.requirements || [],
    learningOutcomes: dbCourse.learning_outcomes || [],
    features: [],
    createdDate: dbCourse.created_at,
    lastUpdated: dbCourse.updated_at,
    publishedDate: dbCourse.published_at || dbCourse.created_at,
    status: dbCourse.status,
    isPopular: dbCourse.is_featured,
    isBestseller: dbCourse.is_featured,
    difficulty: dbCourse.level === 'beginner' ? 1 : dbCourse.level === 'intermediate' ? 2 : 3,
    completionRate: 0,
    averageCompletionTime: `${dbCourse.duration_hours}h`,
  };
};

// Helper function to map database Lesson to UI Lesson
const mapDBLessonToUI = (dbLesson: DBLesson): Lesson => {
  const content = dbLesson.content as any;
  return {
    id: dbLesson.id,
    courseId: dbLesson.course_id,
    moduleId: dbLesson.module_id,
    title: dbLesson.title,
    description: dbLesson.description || '',
    type: dbLesson.type as 'video' | 'quiz' | 'text' | 'assignment',
    duration: `${dbLesson.duration_minutes}m`,
    order: dbLesson.order_index,
    videoUrl: content?.video?.url,
    transcript: dbLesson.transcript || undefined,
    resources: dbLesson.resources as any[] || [],
    questions: content?.quiz?.questions || [],
    passingScore: content?.quiz?.passingScore,
    isPreview: dbLesson.is_preview,
    isCompleted: false,
  };
};

export const useDataStore = create<DataState>()((set, get) => ({
  courses: [],
  lessons: [],
  progress: [],
  reviews: [],
  discussions: [],
  messages: [],
  notifications: [],
  categories: [],
  isLoading: false,

  loadData: async () => {
    set({ isLoading: true });
    
    try {
      // Load courses with instructor info
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(*)
        `)
        .eq('status', 'published');

      if (coursesError) throw coursesError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);

      if (categoriesError) throw categoriesError;

      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Map data to UI types
      const courses = (coursesData || []).map(mapDBCourseToUI);
      const lessons = (lessonsData || []).map(mapDBLessonToUI);
      
      const categories: Category[] = (categoriesData || []).map((cat: DBCategory) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        icon: cat.icon || 'BookOpen',
        subcategories: [],
      }));

      set({
        courses,
        lessons,
        categories,
        reviews: [],
        discussions: [],
        messages: [],
        notifications: [],
        progress: [],
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
    }
  },

  getCourseById: (id: string) => {
    return get().courses.find(course => course.id === id);
  },

  getCoursesByCategory: (category: string) => {
    return get().courses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  },

  getUserProgress: (userId: string, courseId: string) => {
    return get().progress.find(p => p.userId === userId && p.courseId === courseId);
  },

  getCourseLessons: (courseId: string) => {
    return get().lessons.filter(lesson => lesson.courseId === courseId);
  },

  getCourseReviews: (courseId: string) => {
    return get().reviews.filter(review => review.courseId === courseId);
  },

  getCourseDiscussions: (courseId: string) => {
    return get().discussions.filter(discussion => discussion.courseId === courseId);
  },

  getUserMessages: (userId: string) => {
    return get().messages.filter(message => 
      message.senderId === userId || message.receiverId === userId
    );
  },

  getUserNotifications: (userId: string) => {
    return get().notifications.filter(notification => notification.userId === userId);
  },

  markNotificationAsRead: async (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    }));
  },

  markMessageAsRead: async (messageId: string) => {
    set(state => ({
      messages: state.messages.map(message =>
        message.id === messageId
          ? { ...message, isRead: true }
          : message
      )
    }));
  },

  addToWishlist: async (userId: string, courseId: string) => {
    console.log(`Added course ${courseId} to wishlist for user ${userId}`);
  },

  removeFromWishlist: async (userId: string, courseId: string) => {
    console.log(`Removed course ${courseId} from wishlist for user ${userId}`);
  },

  enrollInCourse: async (userId: string, courseId: string) => {
    try {
      const courseLessons = get().getCourseLessons(courseId);
      
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'active',
          progress_percentage: 0,
        } as any);

      if (error) throw error;

      // Create new progress entry locally
      const newProgress: Progress = {
        userId,
        courseId,
        lessonsCompleted: [],
        totalLessons: courseLessons.length,
        progressPercentage: 0,
        lastAccessedLesson: '',
        timeSpent: '0m',
        quizzesCompleted: [],
        notes: [],
        bookmarks: [],
        enrollmentDate: new Date().toISOString(),
        lastAccessDate: new Date().toISOString()
      };

      set(state => ({
        progress: [...state.progress, newProgress]
      }));
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    }
  },

  updateProgress: async (userId: string, courseId: string, lessonId: string) => {
    try {
      // Get enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (!enrollment) return;

      // Update or create lesson progress
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          enrollment_id: enrollment.id,
          status: 'completed',
          completion_percentage: 100,
        } as any);

      if (error) throw error;

      // Update local state
      set(state => ({
        progress: state.progress.map(progress => {
          if (progress.userId === userId && progress.courseId === courseId) {
            const lessonsCompleted = progress.lessonsCompleted.includes(lessonId)
              ? progress.lessonsCompleted
              : [...progress.lessonsCompleted, lessonId];
            
            const progressPercentage = Math.round((lessonsCompleted.length / progress.totalLessons) * 100);
            
            return {
              ...progress,
              lessonsCompleted,
              progressPercentage,
              lastAccessedLesson: lessonId,
              lastAccessDate: new Date().toISOString()
            };
          }
          return progress;
        })
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  },

  addNote: async (userId: string, courseId: string, lessonId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          content,
        } as any);

      if (error) throw error;

      // Update local state
      set(state => ({
        progress: state.progress.map(progress => {
          if (progress.userId === userId && progress.courseId === courseId) {
            return {
              ...progress,
              notes: [
                ...progress.notes,
                {
                  lessonId,
                  content,
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return progress;
        })
      }));
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  },

  addBookmark: async (userId: string, courseId: string, lessonId: string) => {
    set(state => ({
      progress: state.progress.map(progress => {
        if (progress.userId === userId && progress.courseId === courseId) {
          return {
            ...progress,
            bookmarks: progress.bookmarks.includes(lessonId)
              ? progress.bookmarks
              : [...progress.bookmarks, lessonId]
          };
        }
        return progress;
      })
    }));
  },

  removeBookmark: async (userId: string, courseId: string, lessonId: string) => {
    set(state => ({
      progress: state.progress.map(progress => {
        if (progress.userId === userId && progress.courseId === courseId) {
          return {
            ...progress,
            bookmarks: progress.bookmarks.filter(id => id !== lessonId)
          };
        }
        return progress;
      })
    }));
  },

  searchCourses: (query: string) => {
    const courses = get().courses;
    const lowercaseQuery = query.toLowerCase();

    return courses.filter(course =>
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      course.instructorName.toLowerCase().includes(lowercaseQuery)
    );
  },

  addCourse: async (courseData: Partial<DBCourse>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData as any)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const course = mapDBCourseToUI(data as any);
        set(state => ({
          courses: [...state.courses, course]
        }));
      }
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  },

  updateCourse: async (courseId: string, updates: Partial<DBCourse>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updates as any)
        .eq('id', courseId);

      if (error) throw error;

      // Reload courses to get updated data
      await get().loadData();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  },

  deleteCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      set(state => ({
        courses: state.courses.filter(course => course.id !== courseId)
      }));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  }
}));
