import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  Clock,
  Award,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  FileText,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, progress, reviews, getUserNotifications } = useDataStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get instructor's courses
  const instructorCourses = useMemo(() => {
    return courses.filter(course => course.instructorId === user?.id);
  }, [courses, user?.id]);

  // Calculate instructor statistics
  const instructorStats = useMemo(() => {
    if (!user) return null;

    const totalStudents = instructorCourses.reduce((sum, course) => sum + course.totalStudents, 0);
    const totalRevenue = instructorCourses.reduce((sum, course) => sum + (course.price * course.totalStudents), 0);
    const averageRating = instructorCourses.length > 0
      ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length
      : 0;
    const totalReviews = instructorCourses.reduce((sum, course) => sum + course.totalReviews, 0);

    // Get course completion rates
    const completionRates = instructorCourses.map(course => {
      const courseProgress = progress.filter(p => p.courseId === course.id);
      const completedCount = courseProgress.filter(p => p.progressPercentage === 100).length;
      return courseProgress.length > 0 ? (completedCount / courseProgress.length) * 100 : 0;
    });
    const averageCompletion = completionRates.length > 0
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0;

    return {
      totalCourses: instructorCourses.length,
      totalStudents,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      averageCompletion: Math.round(averageCompletion)
    };
  }, [instructorCourses, progress, user]);

  // Get recent student enrollments
  const recentEnrollments = useMemo(() => {
    const enrollments = progress
      .filter(p => instructorCourses.some(course => course.id === p.courseId))
      .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
      .slice(0, 10);

    return enrollments.map(enrollment => {
      const course = instructorCourses.find(c => c.id === enrollment.courseId);
      return { ...enrollment, courseName: course?.title || 'Unknown Course' };
    });
  }, [progress, instructorCourses]);

  // Get instructor's course reviews
  const instructorReviews = useMemo(() => {
    return reviews
      .filter(review => instructorCourses.some(course => course.id === review.courseId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, instructorCourses]);

  // Filter courses based on search and status
  const filteredCourses = useMemo(() => {
    return instructorCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [instructorCourses, searchQuery, filterStatus]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!user || !instructorStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Instructor Dashboard
                </h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Instructor
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user.firstName}! Manage your courses and track student progress.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => navigate('/create-course')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
              <Button variant="outline" onClick={() => navigate('/manage-courses')}>
                <Settings className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorStats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {instructorCourses.filter(c => c.status === 'published').length} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorStats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorStats.averageRating}</div>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(instructorStats.averageRating)}
                <span className="text-xs text-muted-foreground ml-2">
                  ({instructorStats.totalReviews} reviews)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${instructorStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEnrollments.slice(0, 5).map((enrollment, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            New student enrolled in <span className="font-medium">{enrollment.courseName}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentEnrollments.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Course Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Course Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {instructorCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{course.title}</h4>
                          <Badge variant="outline">{course.totalStudents} students</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={course.completionRate} className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {course.completionRate}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            {renderStars(course.rating)}
                            <span>{course.rating}</span>
                          </div>
                          <span>${course.price * course.totalStudents}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {instructorStats.averageCompletion}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average across all courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    New enrollments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    95%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Student messages
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Course Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Courses</h2>
                <p className="text-muted-foreground">Manage your course content and settings</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge
                      className="absolute top-2 left-2"
                      variant={course.status === 'published' ? 'default' : course.status === 'draft' ? 'secondary' : 'outline'}
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{course.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-base">{course.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{course.totalStudents}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        <span className="font-bold text-primary">${course.price}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link to={`/courses/${course.slug}`}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search criteria'
                    : 'Create your first course to get started'
                  }
                </p>
                <Button onClick={() => navigate('/create-course')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-muted-foreground">Track student progress and engagement</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Total Students</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{instructorStats.totalStudents}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active This Week</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(instructorStats.totalStudents * 0.7)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Completed Courses</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(instructorStats.totalStudents * 0.3)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Messages</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 20) + 5}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Enrollments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
                <CardDescription>Latest students who enrolled in your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrolled Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEnrollments.slice(0, 10).map((enrollment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`/images/avatars/student${(index % 3) + 1}.jpg`} />
                              <AvatarFallback>S{index + 1}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Student {index + 1}</div>
                              <div className="text-sm text-muted-foreground">student{index + 1}@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{enrollment.courseName}</div>
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={enrollment.progressPercentage} className="w-16" />
                            <span className="text-sm">{enrollment.progressPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.lastAccessDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Progress
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Course Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into your course performance</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${(instructorStats.totalRevenue * 0.1).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+12.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(instructorStats.totalStudents * 0.15)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+8.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {instructorStats.averageCompletion}%
                  </div>
                  <p className="text-xs text-muted-foreground">Average</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+3.1%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.floor(Math.random() * 20) + 75}%
                  </div>
                  <p className="text-xs text-muted-foreground">Active students</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+5.7%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Student enrollment and completion trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would be here</p>
                      <p className="text-xs text-muted-foreground">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                  <CardDescription>Time spent and activity patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Engagement metrics chart</p>
                      <p className="text-xs text-muted-foreground">Shows lesson completion patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Course Reviews</h2>
                <p className="text-muted-foreground">Student feedback and ratings for your courses</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {instructorCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="all-ratings">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-ratings">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Review Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">{instructorStats.averageRating}</div>
                    <div className="flex items-center space-x-1">
                      {renderStars(instructorStats.averageRating)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on {instructorStats.totalReviews} reviews
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{instructorReviews.filter(r =>
                    new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    In the last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reviews responded to
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Reviews List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest student feedback on your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {instructorReviews.slice(0, 10).map((review) => {
                    const course = instructorCourses.find(c => c.id === review.courseId);
                    return (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>
                              {review.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{review.userName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {course?.title} • {new Date(review.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <h5 className="font-medium mb-2">{review.title}</h5>
                            <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                            <div className="flex items-center space-x-4">
                              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                👍 Helpful ({review.helpful})
                              </button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {instructorReviews.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      Reviews will appear here once students start rating your courses
                    </p>
                  </div>
                )}

                {instructorReviews.length > 10 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorDashboard;