import { create } from 'zustand';
import { Course, Lesson, Progress, Review, Discussion, Message, Notification, Category } from '../types';

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
  markNotificationAsRead: (notificationId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  addToWishlist: (userId: string, courseId: string) => void;
  removeFromWishlist: (userId: string, courseId: string) => void;
  enrollInCourse: (userId: string, courseId: string) => void;
  updateProgress: (userId: string, courseId: string, lessonId: string) => void;
  addNote: (userId: string, courseId: string, lessonId: string, content: string) => void;
  addBookmark: (userId: string, courseId: string, lessonId: string) => void;
  removeBookmark: (userId: string, courseId: string, lessonId: string) => void;
  searchCourses: (query: string) => Course[];
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
}

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
      const [
        coursesResponse,
        lessonsResponse,
        reviewsResponse,
        discussionsResponse
      ] = await Promise.all([
        fetch('/data/courses.json'),
        fetch('/data/lessons.json'),
        fetch('/data/reviews.json'),
        fetch('/data/discussions.json')
      ]);

      const [
        coursesData,
        lessonsData,
        reviewsData,
        discussionsData
      ] = await Promise.all([
        coursesResponse.json(),
        lessonsResponse.json(),
        reviewsResponse.json(),
        discussionsResponse.json()
      ]);

      set({
        courses: coursesData.courses,
        categories: coursesData.categories,
        lessons: lessonsData.lessons,
        progress: lessonsData.progress,
        reviews: reviewsData.reviews,
        discussions: discussionsData.discussions,
        messages: discussionsData.messages,
        notifications: discussionsData.notifications,
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

  markNotificationAsRead: (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    }));
  },

  markMessageAsRead: (messageId: string) => {
    set(state => ({
      messages: state.messages.map(message =>
        message.id === messageId
          ? { ...message, isRead: true }
          : message
      )
    }));
  },

  addToWishlist: (userId: string, courseId: string) => {
    // This would normally make an API call
    console.log(`Added course ${courseId} to wishlist for user ${userId}`);
  },

  removeFromWishlist: (userId: string, courseId: string) => {
    // This would normally make an API call
    console.log(`Removed course ${courseId} from wishlist for user ${userId}`);
  },

  enrollInCourse: (userId: string, courseId: string) => {
    // This would normally make an API call
    console.log(`User ${userId} enrolled in course ${courseId}`);
    
    // Add new progress entry
    const newProgress: Progress = {
      userId,
      courseId,
      lessonsCompleted: [],
      totalLessons: get().getCourseLessons(courseId).length,
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
  },

  updateProgress: (userId: string, courseId: string, lessonId: string) => {
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
  },

  addNote: (userId: string, courseId: string, lessonId: string, content: string) => {
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
  },

  addBookmark: (userId: string, courseId: string, lessonId: string) => {
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

  removeBookmark: (userId: string, courseId: string, lessonId: string) => {
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

  addCourse: (course: Course) => {
    set(state => ({
      courses: [...state.courses, course]
    }));
  },

  updateCourse: (courseId: string, updates: Partial<Course>) => {
    set(state => ({
      courses: state.courses.map(course =>
        course.id === courseId ? { ...course, ...updates } : course
      )
    }));
  },

  deleteCourse: (courseId: string) => {
    set(state => ({
      courses: state.courses.filter(course => course.id !== courseId)
    }));
  }
}));
