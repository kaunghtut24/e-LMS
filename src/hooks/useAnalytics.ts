import { useState, useEffect, useMemo } from 'react';

interface DateRange {
  from: Date;
  to: Date;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface AnalyticsData {
  timeSeries: {
    enrollments: TimeSeriesData[];
    completions: TimeSeriesData[];
    revenue: TimeSeriesData[];
    activeUsers: TimeSeriesData[];
  };
  categories: {
    label: string;
    value: number;
    color: string;
  }[];
  metrics: {
    total: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface UseAnalyticsOptions {
  dateRange?: DateRange;
  refreshInterval?: number;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { dateRange, refreshInterval } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock analytics data generator
  const generateMockData = (days: number) => {
    const data: TimeSeriesData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 20,
      });
    }

    return data;
  };

  const data: AnalyticsData = useMemo(() => {
    const days = dateRange
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 30;

    return {
      timeSeries: {
        enrollments: generateMockData(days),
        completions: generateMockData(days),
        revenue: generateMockData(days),
        activeUsers: generateMockData(days),
      },
      categories: [
        { label: 'Web Development', value: 35, color: 'rgb(59, 130, 246)' },
        { label: 'Mobile Development', value: 25, color: 'rgb(16, 185, 129)' },
        { label: 'Data Science', value: 20, color: 'rgb(245, 158, 11)' },
        { label: 'DevOps', value: 12, color: 'rgb(139, 92, 246)' },
        { label: 'Other', value: 8, color: 'rgb(236, 72, 153)' },
      ],
      metrics: {
        total: 12543,
        change: 12.5,
        trend: 'up',
      },
    };
  }, [dateRange]);

  // Auto-refresh data
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      // Simulate data refresh
      console.log('Refreshing analytics data...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    data,
    isLoading,
    error,
  };
}

export function useStudentAnalytics(userId?: string) {
  const { data, isLoading, error } = useAnalytics();

  const studentMetrics = useMemo(() => {
    if (!userId) return null;

    return {
      coursesEnrolled: 8,
      coursesCompleted: 3,
      totalHoursLearned: 47.5,
      averageScore: 85,
      streakDays: 7,
      certificates: 3,
      skillsAcquired: 12,
      currentLevel: 'Intermediate',
    };
  }, [userId]);

  return {
    data,
    metrics: studentMetrics,
    isLoading,
    error,
  };
}

export function useInstructorAnalytics(instructorId?: string) {
  const { data, isLoading, error } = useAnalytics();

  const instructorMetrics = useMemo(() => {
    if (!instructorId) return null;

    return {
      totalCourses: 12,
      totalStudents: 1245,
      averageRating: 4.7,
      totalRevenue: 45600,
      completionRate: 78,
      monthlyEarnings: 3800,
      newEnrollments: 156,
      responseRate: 94,
    };
  }, [instructorId]);

  return {
    data,
    metrics: instructorMetrics,
    isLoading,
    error,
  };
}

export function useAdminAnalytics() {
  const { data, isLoading, error } = useAnalytics();

  const adminMetrics = useMemo(() => {
    return {
      totalUsers: 15420,
      totalCourses: 234,
      totalRevenue: 125430,
      activeUsers: 8934,
      newSignups: 432,
      systemHealth: 99.2,
      avgSessionTime: 28.5,
      bounceRate: 23.4,
    };
  }, []);

  return {
    data,
    metrics: adminMetrics,
    isLoading,
    error,
  };
}

export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState([
    { label: 'Active Users', value: 234, change: 5.2, status: 'online' as const },
    { label: 'Live Sessions', value: 45, change: -2.1, status: 'online' as const },
    { label: 'Server Load', value: 68, change: 12.3, status: 'warning' as const },
    { label: 'Response Time', value: 145, change: -5.7, status: 'online' as const },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            typeof metric.value === 'number'
              ? Math.max(0, metric.value + (Math.random() - 0.5) * 10)
              : metric.value,
          change: (Math.random() - 0.5) * 20,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
