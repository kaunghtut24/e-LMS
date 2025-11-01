import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AnalyticsCard from './AnalyticsCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import DonutChart from './DonutChart';
import DateRangePicker from './DateRangePicker';
import { useInstructorAnalytics } from '@/hooks/useAnalytics';

export default function InstructorAnalytics() {
  const { data, metrics } = useInstructorAnalytics('instructor-123');
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

  const revenueData = data.timeSeries.revenue.map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  const enrollmentData = data.timeSeries.enrollments.map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  const coursePerformance = [
    { label: 'React Fundamentals', value: 850, color: 'rgb(59, 130, 246)' },
    { label: 'TypeScript Masterclass', value: 620, color: 'rgb(16, 185, 129)' },
    { label: 'Node.js Backend', value: 490, color: 'rgb(245, 158, 11)' },
    { label: 'Python for Beginners', value: 380, color: 'rgb(139, 92, 246)' },
  ];

  const studentEngagement = [
    { label: 'Active Students', value: 850, color: 'rgb(59, 130, 246)' },
    { label: 'Inactive', value: 150, color: 'rgb(229, 231, 235)' },
  ];

  const topPerformingLessons = [
    { name: 'React Hooks Introduction', completions: 245, rating: 4.8 },
    { name: 'TypeScript Generics', completions: 198, rating: 4.7 },
    { name: 'Node.js Authentication', completions: 176, rating: 4.9 },
    { name: 'Python Data Structures', completions: 154, rating: 4.6 },
  ];

  const monthlyComparison = [
    { label: 'Jan', students: 45, revenue: 3200 },
    { label: 'Feb', students: 62, revenue: 4100 },
    { label: 'Mar', students: 58, revenue: 3800 },
    { label: 'Apr', students: 71, revenue: 4500 },
    { label: 'May', students: 68, revenue: 4300 },
    { label: 'Jun', students: 85, revenue: 5200 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Instructor Analytics</h2>
          <p className="text-muted-foreground">
            Track your course performance and student engagement
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Students"
          value={metrics.totalStudents.toLocaleString()}
          description="Enrolled across all courses"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          description="Lifetime earnings"
          icon={DollarSign}
          trend={{ value: 18.2, isPositive: true }}
        />
        <AnalyticsCard
          title="Average Rating"
          value={metrics.averageRating}
          icon={Star}
          trend={{ value: 5.3, isPositive: true }}
        />
        <AnalyticsCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={Award}
          trend={{ value: 8.7, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue & Enrollment Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Your earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={revenueData}
                  height={250}
                  color="rgb(34, 197, 94)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Enrollments</CardTitle>
                <CardDescription>Student sign-ups per day</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={enrollmentData}
                  height={250}
                  color="rgb(59, 130, 246)"
                />
              </CardContent>
            </Card>
          </div>

          {/* Course Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Enrollment by course</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={coursePerformance}
                height={300}
                horizontal
                showValues
              />
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>Students and revenue comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyComparison.map((month, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{month.label} 2024</h4>
                      <Badge variant="outline">Month {index + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">New Students</p>
                        <p className="text-xl font-bold">{month.students}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold">${month.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Monthly Earnings"
              value={`$${metrics.monthlyEarnings.toLocaleString()}`}
              description="This month"
              icon={DollarSign}
              trend={{ value: 22.5, isPositive: true }}
            />
            <AnalyticsCard
              title="Average Course Price"
              value="$89"
              icon={BookOpen}
              trend={{ value: 5.2, isPositive: true }}
            />
            <AnalyticsCard
              title="Revenue Growth"
              value="+18.2%"
              description="vs last month"
              icon={TrendingUp}
              trend={{ value: 18.2, isPositive: true }}
            />
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Course</CardTitle>
                <CardDescription>Course contribution to total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { label: 'React Fundamentals', value: 35000, color: 'rgb(59, 130, 246)' },
                    { label: 'TypeScript Course', value: 28000, color: 'rgb(16, 185, 129)' },
                    { label: 'Node.js Course', value: 22000, color: 'rgb(245, 158, 11)' },
                    { label: 'Python Course', value: 18000, color: 'rgb(139, 92, 246)' },
                  ]}
                  size={250}
                  showLegend
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={revenueData}
                  height={250}
                  color="rgb(34, 197, 94)"
                  showGrid
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Student Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Active Students"
              value={850}
              description="Last 30 days"
              icon={Users}
              trend={{ value: 15.2, isPositive: true }}
            />
            <AnalyticsCard
              title="New Enrollments"
              value={metrics.newEnrollments}
              description="This month"
              icon={TrendingUp}
              trend={{ value: 8.7, isPositive: true }}
            />
            <AnalyticsCard
              title="Response Rate"
              value={`${metrics.responseRate}%`}
              description="Student messages"
              icon={MessageSquare}
              trend={{ value: 3.2, isPositive: true }}
            />
            <AnalyticsCard
              title="Avg Session Time"
              value="28m"
              description="Per student"
              icon={Clock}
              trend={{ value: 12.5, isPositive: true }}
            />
          </div>

          {/* Student Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Active vs inactive students</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={studentEngagement}
                  size={250}
                  strokeWidth={50}
                  centerLabel="Students"
                  centerValue={metrics.totalStudents.toString()}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Growth</CardTitle>
                <CardDescription>New student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={enrollmentData}
                  height={250}
                  color="rgb(59, 130, 246)"
                />
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Lessons</CardTitle>
              <CardDescription>Most popular lessons by completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingLessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{lesson.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {lesson.completions} completions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{lesson.rating}</span>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {/* Course Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Total Courses"
              value={metrics.totalCourses}
              icon={BookOpen}
              trend={{ value: 20.0, isPositive: true }}
            />
            <AnalyticsCard
              title="Avg Completion Rate"
              value={`${metrics.completionRate}%`}
              icon={Award}
              trend={{ value: 5.8, isPositive: true }}
            />
            <AnalyticsCard
              title="Avg Rating"
              value={metrics.averageRating}
              icon={Star}
              trend={{ value: 3.2, isPositive: true }}
            />
          </div>

          {/* Course Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment Comparison</CardTitle>
              <CardDescription>Student enrollment by course</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={coursePerformance}
                height={300}
                horizontal
                showValues
              />
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
              <CardDescription>Detailed stats for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursePerformance.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{course.label}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Students</span>
                        <span className="font-medium">{course.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 30) + 70}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-medium">
                          {(Math.random() * 0.5 + 4.5).toFixed(1)} ⭐
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">
                          ${(course.value * 89).toLocaleString()}
                        </span>
                      </div>
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
