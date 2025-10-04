import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, Award, Play, Calendar, Target, Star, ChevronRight, BarChart3, Users, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Bookmark as BookmarkIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { getUserDisplayName } from '../lib/profileAdapter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { courses, progress, getUserNotifications, getCourseById, getUserProgress } = useDataStore();

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!user) return null;

    const userProgress = progress.filter(p => p.userId === user.id);
    const enrolledCourses = userProgress.length;
    const completedCourses = userProgress.filter(p => p.progressPercentage === 100).length;
    const totalTimeSpent = userProgress.reduce((total, p) => {
      const timeMatch = p.timeSpent.match(/(\d+)h?\s*(\d+)?m?/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]) || 0;
        const minutes = parseInt(timeMatch[2]) || 0;
        return total + (hours * 60) + minutes;
      }
      return total;
    }, 0);

    const averageProgress = enrolledCourses > 0
      ? Math.round(userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / enrolledCourses)
      : 0;

    return {
      enrolledCourses,
      completedCourses,
      totalTimeSpent: Math.round(totalTimeSpent / 60 * 10) / 10, // Convert to hours with 1 decimal
      averageProgress,
      activeStreak: 7 // Mock data for now
    };
  }, [user, progress]);

  // Get user's enrolled courses with progress
  const enrolledCoursesWithProgress = useMemo(() => {
    if (!user) return [];

    return progress
      .filter(p => p.userId === user.id)
      .map(p => {
        const course = getCourseById(p.courseId);
        return course ? { ...course, progress: p } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.progress.lastAccessDate).getTime() - new Date(a.progress.lastAccessDate).getTime());
  }, [user, progress, getCourseById]);

  // Get recent activity and notifications
  const recentNotifications = user ? getUserNotifications(user.id).slice(0, 5) : [];

  // Get recommended courses (courses not enrolled in)
  const recommendedCourses = useMemo(() => {
    if (!user) return [];

    const enrolledCourseIds = progress
      .filter(p => p.userId === user.id)
      .map(p => p.courseId);

    return courses
      .filter(course => !enrolledCourseIds.includes(course.id))
      .filter(course => course.isPopular || course.isBestseller)
      .slice(0, 4);
  }, [user, courses, progress]);

  if (!user || !userStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
                  Welcome back, {user.first_name}! 👋
                </h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {user.role === 'learner' ? 'Student' : user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{userStats.activeStreak} day streak</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.enrolledCourses}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.completedCourses} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalTimeSpent}h</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.averageProgress}%</div>
              <Progress value={userStats.averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Earned this year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Progress & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Continue Learning</span>
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCoursesWithProgress.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCoursesWithProgress.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            By {course.instructorName}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Progress value={course.progress.progressPercentage} className="flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {course.progress.progressPercentage}%
                            </span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/courses/${course.slug}`}>
                            Continue
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {enrolledCoursesWithProgress.length > 3 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/courses">View All Courses</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Button asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Learning Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recent" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recent" className="space-y-4 mt-4">
                    {enrolledCoursesWithProgress.length > 0 ? (
                      enrolledCoursesWithProgress.slice(0, 5).map((course) => (
                        <div key={course.id} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <span className="text-muted-foreground">
                              Studied <span className="font-medium text-foreground">{course.title}</span>
                            </span>
                            <div className="text-xs text-muted-foreground">
                              {new Date(course.progress.lastAccessDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.progress.progressPercentage}%
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Award className="w-8 h-8 text-yellow-500" />
                        <div>
                          <div className="font-medium text-sm">First Course</div>
                          <div className="text-xs text-muted-foreground">Enrolled in your first course</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Target className="w-8 h-8 text-blue-500" />
                        <div>
                          <div className="font-medium text-sm">7 Day Streak</div>
                          <div className="text-xs text-muted-foreground">Learning consistently</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications & Recommendations */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Notifications</span>
                  </div>
                  {recentNotifications.filter(n => !n.isRead).length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {recentNotifications.filter(n => !n.isRead).length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {recentNotifications.map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg border ${!notification.isRead ? 'bg-accent/50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{notification.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/messages">View All Notifications</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No new notifications
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Recommended for You</span>
                </CardTitle>
                <CardDescription>
                  Courses you might like
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedCourses.map((course) => (
                      <div key={course.id} className="group">
                        <Link to={`/courses/${course.slug}`} className="block">
                          <div className="flex space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                                {course.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                By {course.instructorName}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{course.rating}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {course.level}
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </Link>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/courses">Explore More Courses</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recommendations available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/courses">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <Users className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/messages">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;