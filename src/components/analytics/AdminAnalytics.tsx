import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Activity,
  Server,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnalyticsCard from './AnalyticsCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import DonutChart from './DonutChart';
import RealtimeMetrics from './RealtimeMetrics';
import HeatMap from './HeatMap';
import ProgressRing from './ProgressRing';
import DateRangePicker from './DateRangePicker';
import { useAdminAnalytics, useRealtimeMetrics } from '@/hooks/useAnalytics';

export default function AdminAnalytics() {
  const { data, metrics } = useAdminAnalytics();
  const realtimeMetrics = useRealtimeMetrics();
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
    value: item.value * 100,
  }));

  const userGrowthData = data.timeSeries.activeUsers.map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  const userDemographics = [
    { label: 'Students', value: 8500, color: 'rgb(59, 130, 246)' },
    { label: 'Instructors', value: 450, color: 'rgb(16, 185, 129)' },
    { label: 'Admins', value: 25, color: 'rgb(245, 158, 11)' },
  ];

  const courseCategories = data.categories;

  const platformHealth = [
    { label: 'CPU Usage', value: 35, intensity: 0.35 },
    { label: 'Memory', value: 68, intensity: 0.68 },
    { label: 'Storage', value: 45, intensity: 0.45 },
    { label: 'Network', value: 28, intensity: 0.28 },
    { label: 'Database', value: 52, intensity: 0.52 },
    { label: 'Load Avg', value: 42, intensity: 0.42 },
    { label: 'Disk I/O', value: 38, intensity: 0.38 },
    { label: 'Response', value: 145, intensity: 0.55 },
  ];

  const topCourses = [
    { label: 'React Fundamentals', value: 2450, color: 'rgb(59, 130, 246)' },
    { label: 'TypeScript Master', value: 1920, color: 'rgb(16, 185, 129)' },
    { label: 'Python Basics', value: 1650, color: 'rgb(245, 158, 11)' },
    { label: 'Node.js Backend', value: 1380, color: 'rgb(139, 92, 246)' },
    { label: 'Vue.js Complete', value: 1150, color: 'rgb(236, 72, 153)' },
  ];

  const topInstructors = [
    { name: 'John Doe', courses: 12, students: 8450, rating: 4.9 },
    { name: 'Jane Smith', courses: 8, students: 6720, rating: 4.8 },
    { name: 'Bob Johnson', courses: 15, students: 5890, rating: 4.7 },
    { name: 'Alice Williams', courses: 6, students: 4920, rating: 4.9 },
  ];

  const systemLogs = [
    { type: 'success', message: 'Database backup completed successfully', time: '2 hours ago' },
    { type: 'warning', message: 'High memory usage detected on server-2', time: '4 hours ago' },
    { type: 'info', message: 'New SSL certificate installed', time: '1 day ago' },
    { type: 'success', message: 'System update deployed successfully', time: '1 day ago' },
    { type: 'error', message: 'Failed login attempt from suspicious IP', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive platform performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          description={`${metrics.activeUsers.toLocaleString()} active`}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          description="Lifetime platform revenue"
          icon={DollarSign}
          trend={{ value: 18.7, isPositive: true }}
        />
        <AnalyticsCard
          title="Total Courses"
          value={metrics.totalCourses}
          icon={BookOpen}
          trend={{ value: 8.3, isPositive: true }}
        />
        <AnalyticsCard
          title="System Health"
          value={`${metrics.systemHealth}%`}
          description="All systems operational"
          icon={Activity}
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Realtime Metrics */}
          <RealtimeMetrics metrics={realtimeMetrics} />

          {/* Revenue & User Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
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
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={userGrowthData}
                  height={250}
                  color="rgb(59, 130, 246)"
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="New Signups"
              value={metrics.newSignups}
              description="This month"
              icon={TrendingUp}
              trend={{ value: 15.2, isPositive: true }}
            />
            <AnalyticsCard
              title="Active Sessions"
              value={Math.floor(Math.random() * 500) + 200}
              description="Right now"
              icon={Activity}
            />
            <AnalyticsCard
              title="Avg Session Time"
              value={`${metrics.avgSessionTime}m`}
              description="Per user"
              icon={Users}
              trend={{ value: 5.8, isPositive: true }}
            />
            <AnalyticsCard
              title="Bounce Rate"
              value={`${metrics.bounceRate}%`}
              description="Website bounce rate"
              icon={TrendingUp}
              trend={{ value: -3.2, isPositive: false }}
            />
          </div>

          {/* Platform Health Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
              <CardDescription>Real-time system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <HeatMap
                data={platformHealth}
                title="System Resources"
                colorScheme="blue"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total Users"
              value={metrics.totalUsers.toLocaleString()}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
            />
            <AnalyticsCard
              title="Active Users"
              value={metrics.activeUsers.toLocaleString()}
              icon={Activity}
              trend={{ value: 8.7, isPositive: true }}
            />
            <AnalyticsCard
              title="New Signups"
              value={metrics.newSignups}
              description="This month"
              icon={TrendingUp}
              trend={{ value: 15.2, isPositive: true }}
            />
            <AnalyticsCard
              title="Conversion Rate"
              value="3.2%"
              description="Visitor to signup"
              icon={Users}
              trend={{ value: 0.8, isPositive: true }}
            />
          </div>

          {/* User Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={userDemographics}
                  size={250}
                  showLegend
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Monthly user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={userGrowthData}
                  height={250}
                  color="rgb(59, 130, 246)"
                />
              </CardContent>
            </Card>
          </div>

          {/* Top Instructors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Instructors</CardTitle>
              <CardDescription>Highest performing instructors by students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topInstructors.map((instructor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-sm">{instructor.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{instructor.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {instructor.courses} courses
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{instructor.students.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">students</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{instructor.rating}</span>
                        <span>⭐</span>
                      </div>
                    </div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              description="Lifetime platform revenue"
              icon={DollarSign}
              trend={{ value: 18.7, isPositive: true }}
            />
            <AnalyticsCard
              title="Monthly Revenue"
              value="$45,230"
              description="This month"
              icon={TrendingUp}
              trend={{ value: 22.5, isPositive: true }}
            />
            <AnalyticsCard
              title="Avg Order Value"
              value="$89"
              icon={DollarSign}
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
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Course Category</CardTitle>
                <CardDescription>Course category contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={courseCategories}
                  size={250}
                  showLegend
                />
              </CardContent>
            </Card>
          </div>

          {/* Revenue Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Statistics</CardTitle>
              <CardDescription>Detailed revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Transactions', value: '12,543', change: '+8.2%' },
                  { label: 'Successful Payments', value: '12,180', change: '+8.5%' },
                  { label: 'Failed Payments', value: '363', change: '-2.1%' },
                  { label: 'Refund Rate', value: '2.1%', change: '-0.3%' },
                  { label: 'Tax Collected', value: '$12,340', change: '+15.2%' },
                  { label: 'Processing Fees', value: '$890', change: '+5.7%' },
                ].map((stat, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge
                        variant="outline"
                        className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Server Uptime"
              value="99.9%"
              icon={Server}
              trend={{ value: 0.1, isPositive: true }}
            />
            <AnalyticsCard
              title="CPU Usage"
              value="35%"
              icon={Activity}
              trend={{ value: 5.2, isPositive: false }}
            />
            <AnalyticsCard
              title="Memory Usage"
              value="68%"
              icon={HardDrive}
              trend={{ value: 3.8, isPositive: false }}
            />
            <AnalyticsCard
              title="Network I/O"
              value="45%"
              icon={Wifi}
              trend={{ value: 8.2, isPositive: false }}
            />
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'CPU Usage', value: 35, color: 'bg-blue-500' },
                    { label: 'Memory Usage', value: 68, color: 'bg-yellow-500' },
                    { label: 'Disk Usage', value: 45, color: 'bg-green-500' },
                    { label: 'Network Load', value: 28, color: 'bg-blue-500' },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall System Health</CardTitle>
                <CardDescription>Platform health score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ProgressRing
                    value={metrics.systemHealth}
                    size={200}
                    strokeWidth={15}
                    label="System Health"
                    color="rgb(34, 197, 94)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Events</CardTitle>
              <CardDescription>Latest system activities and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'warning' ? 'bg-yellow-500' :
                      log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total Courses"
              value={metrics.totalCourses}
              icon={BookOpen}
              trend={{ value: 8.3, isPositive: true }}
            />
            <AnalyticsCard
              title="Published Courses"
              value={210}
              icon={CheckCircle}
              trend={{ value: 12.5, isPositive: true }}
            />
            <AnalyticsCard
              title="Draft Courses"
              value={24}
              icon={BookOpen}
              trend={{ value: -5.2, isPositive: false }}
            />
            <AnalyticsCard
              title="Avg Course Rating"
              value="4.7"
              icon={TrendingUp}
              trend={{ value: 3.2, isPositive: true }}
            />
          </div>

          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>Most popular courses by enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={topCourses}
                height={350}
                horizontal
                showValues
              />
            </CardContent>
          </Card>

          {/* Course Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Course Distribution</CardTitle>
              <CardDescription>Courses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart
                data={courseCategories}
                size={300}
                showLegend
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
