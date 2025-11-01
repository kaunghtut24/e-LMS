import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AnalyticsCard from './AnalyticsCard';
import LineChart from './LineChart';
import DonutChart from './DonutChart';
import ProgressRing from './ProgressRing';
import MetricsGrid from './MetricsGrid';
import DateRangePicker from './DateRangePicker';
import { useStudentAnalytics } from '@/hooks/useAnalytics';

export default function StudentAnalytics() {
  const { data, metrics } = useStudentAnalytics('user-123');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  const skillsData = [
    { label: 'React', value: 85, color: 'rgb(59, 130, 246)' },
    { label: 'TypeScript', value: 72, color: 'rgb(16, 185, 129)' },
    { label: 'Node.js', value: 65, color: 'rgb(245, 158, 11)' },
    { label: 'Python', value: 78, color: 'rgb(139, 92, 246)' },
  ];

  const weeklyProgress = data.timeSeries.enrollments.map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  const courseCategories = [
    { label: 'Web Development', value: 5, color: 'rgb(59, 130, 246)' },
    { label: 'Mobile', value: 2, color: 'rgb(16, 185, 129)' },
    { label: 'Backend', value: 3, color: 'rgb(245, 158, 11)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Learning Analytics</h2>
          <p className="text-muted-foreground">
            Track your learning progress and achievements
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Courses Enrolled"
          value={metrics.coursesEnrolled}
          description="Active courses"
          icon={BookOpen}
          trend={{ value: 15.2, isPositive: true }}
        />
        <AnalyticsCard
          title="Learning Time"
          value={`${metrics.totalHoursLearned}h`}
          description="This month"
          icon={Clock}
          trend={{ value: 8.7, isPositive: true }}
        />
        <AnalyticsCard
          title="Certificates"
          value={metrics.certificates}
          description="Earned certificates"
          icon={Award}
          trend={{ value: 25.0, isPositive: true }}
        />
        <AnalyticsCard
          title="Current Level"
          value={metrics.currentLevel}
          description="Based on progress"
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills & Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Learning Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Learning Hours</CardTitle>
                <CardDescription>Your learning activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={weeklyProgress}
                  height={250}
                  color="rgb(59, 130, 246)"
                />
              </CardContent>
            </Card>

            {/* Course Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Course Distribution</CardTitle>
                <CardDescription>Your enrolled courses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={courseCategories}
                  size={250}
                  strokeWidth={40}
                />
              </CardContent>
            </Card>
          </div>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Current progress on enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'React Fundamentals', progress: 85, lessons: 24, completed: 20 },
                  { name: 'Advanced TypeScript', progress: 62, lessons: 18, completed: 11 },
                  { name: 'Node.js Backend', progress: 45, lessons: 30, completed: 14 },
                ].map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{course.name}</h4>
                      <Badge variant="outline">{course.progress}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {course.completed}/{course.lessons} lessons completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Proficiency</CardTitle>
                <CardDescription>Your skill levels across technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{skill.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.value}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${skill.value}%`,
                            backgroundColor: skill.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'React Master',
                      description: 'Completed React Fundamentals course',
                      icon: Trophy,
                      color: 'text-yellow-500',
                    },
                    {
                      title: 'TypeScript Pro',
                      description: 'Achieved 90%+ score on TypeScript assessment',
                      icon: Award,
                      color: 'text-blue-500',
                    },
                    {
                      title: '7-Day Streak',
                      description: 'Learning consistently for a week',
                      icon: Calendar,
                      color: 'text-green-500',
                    },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Ring */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Learning Progress</CardTitle>
              <CardDescription>
                Your completion percentage across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <ProgressRing
                    value={68}
                    size={200}
                    strokeWidth={12}
                    label="Overall Progress"
                    color="rgb(59, 130, 246)"
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    You're doing great! Keep up the momentum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Study Streak"
              value={`${metrics.streakDays} days`}
              icon={Target}
              trend={{ value: 14.2, isPositive: true }}
            />
            <AnalyticsCard
              title="Average Score"
              value={`${metrics.averageScore}%`}
              icon={TrendingUp}
              trend={{ value: 5.8, isPositive: true }}
            />
            <AnalyticsCard
              title="Skills Acquired"
              value={metrics.skillsAcquired}
              description="This year"
              icon={Award}
              trend={{ value: 22.1, isPositive: true }}
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Activity</CardTitle>
              <CardDescription>Your recent learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Completed lesson',
                    course: 'React Fundamentals',
                    time: '2 hours ago',
                    icon: BookOpen,
                  },
                  {
                    action: 'Earned certificate',
                    course: 'TypeScript Basics',
                    time: '1 day ago',
                    icon: Award,
                  },
                  {
                    action: 'Started new course',
                    course: 'Node.js Advanced',
                    time: '3 days ago',
                    icon: BookOpen,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.action}{' '}
                        <span className="text-muted-foreground">
                          in {activity.course}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
