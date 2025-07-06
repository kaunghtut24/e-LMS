import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  Globe,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  MoreHorizontal,
  Home,
  Navigation
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { useUserStore } from '../store/userStore';
import UserFormModal from '../components/UserFormModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { courses, progress, reviews, discussions, notifications, isLoading } = useDataStore();
  const {
    users,
    isLoading: usersLoading,
    loadUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getTotalUsers,
    getActiveUsers,
    getUsersByRole,
    getSuspendedUsers
  } = useUserStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // User management modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // User management action handlers
  const handleUserStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateUserStatus(userId, newStatus as 'active' | 'suspended');
  };

  const handleUserDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleAddUser = (userData: any) => {
    addUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar || '/images/avatars/default.jpg',
      bio: userData.bio || '',
      socialLinks: { linkedin: '', twitter: '', github: '' },
      expertise: [],
      coursesCreated: userData.role === 'instructor' ? [] : undefined,
      totalStudents: userData.role === 'instructor' ? 0 : undefined,
      rating: userData.role === 'instructor' ? 0 : undefined,
      enrolledCourses: userData.role === 'student' ? [] : undefined,
      completedCourses: userData.role === 'student' ? [] : undefined,
      wishlist: userData.role === 'student' ? [] : undefined,
      achievements: userData.role === 'student' ? [] : undefined,
      preferences: { theme: 'light', notifications: true, language: 'en' }
    });
    setShowAddUserModal(false);
  };

  const handleUpdateUser = (userData: any) => {
    if (selectedUser) {
      // Update user role if changed
      if (userData.role !== selectedUser.role) {
        updateUserRole(selectedUser.id, userData.role);
      }
      // In a real app, you would also update other user fields
      console.log('Updating user:', selectedUser.id, userData);
    }
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  // Course management action handlers
  const handleCourseStatusChange = (courseId: string, newStatus: string) => {
    // In a real app, this would update the course status via API
    console.log(`Changing course ${courseId} status to ${newStatus}`);
  };

  const handleCourseDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      // In a real app, this would delete the course via API
      console.log(`Deleting course ${courseId}`);
    }
  };

  // Transform users data for display
  const transformedUsers = useMemo(() => {
    return users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      joinDate: user.dateJoined,
      lastLogin: user.lastLogin,
      avatar: user.avatar,
      bio: user.bio
    }));
  }, [users]);

  // Calculate platform statistics
  const platformStats = useMemo(() => {
    const totalUsers = getTotalUsers();
    const activeUsers = getActiveUsers();
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const totalEnrollments = progress.length;
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.totalStudents), 0);
    const averageRating = courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => !r.verified).length;
    const reportedContent = Math.floor(Math.random() * 10) + 2; // Mock data

    return {
      totalUsers,
      activeUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      pendingReviews,
      reportedContent,
      systemHealth: 98.5, // Mock system health percentage
      serverUptime: '99.9%',
      storageUsed: 75, // Mock storage percentage
      bandwidthUsed: 45 // Mock bandwidth percentage
    };
  }, [users, courses, progress, reviews, getTotalUsers, getActiveUsers]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const activities = [
      ...progress.slice(0, 5).map(p => ({
        type: 'enrollment',
        description: `New student enrolled in course`,
        timestamp: p.enrollmentDate,
        icon: UserCheck
      })),
      ...reviews.slice(0, 3).map(r => ({
        type: 'review',
        description: `New review: "${r.title}"`,
        timestamp: r.date,
        icon: Star
      })),
      ...courses.slice(0, 2).map(c => ({
        type: 'course',
        description: `Course "${c.title}" was updated`,
        timestamp: c.lastUpdated,
        icon: BookOpen
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, 10);
  }, [progress, reviews, courses]);

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return transformedUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [transformedUsers, searchQuery, filterRole]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
                  Admin Dashboard
                </h1>
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Administrator
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">
                Platform overview and management tools
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild>
                <Link to="/cms">
                  <Edit className="w-4 h-4 mr-2" />
                  Content Management
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {platformStats.activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {platformStats.publishedCourses} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {platformStats.totalEnrollments} enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{platformStats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
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
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Platform Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Uptime</span>
                    <Badge variant="default" className="bg-green-500">
                      {platformStats.serverUptime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={platformStats.storageUsed} className="w-20" />
                      <span className="text-sm">{platformStats.storageUsed}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bandwidth Used</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={platformStats.bandwidthUsed} className="w-20" />
                      <span className="text-sm">{platformStats.bandwidthUsed}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Reviews</span>
                    <Badge variant="outline">
                      {platformStats.pendingReviews}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reported Content</span>
                    <Badge variant="destructive">
                      {platformStats.reportedContent}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Management Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Content Management</span>
                </CardTitle>
                <CardDescription>
                  Manage your website content dynamically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild className="h-auto p-4 flex flex-col items-start space-y-2">
                    <Link to="/cms">
                      <div className="flex items-center space-x-2 w-full">
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Edit Homepage</span>
                      </div>
                      <p className="text-sm opacity-70 text-left">Hero, stats, featured content</p>
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-start space-y-2">
                    <Link to="/cms">
                      <div className="flex items-center space-x-2 w-full">
                        <Navigation className="w-5 h-5" />
                        <span className="font-medium">Navigation & Footer</span>
                      </div>
                      <p className="text-sm opacity-70 text-left">Menu links, branding</p>
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-start space-y-2">
                    <Link to="/cms">
                      <div className="flex items-center space-x-2 w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Site Settings</span>
                      </div>
                      <p className="text-sm opacity-70 text-left">Global configuration</p>
                    </Link>
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last content update: 2 hours ago
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/cms">
                      <Edit className="w-4 h-4 mr-2" />
                      Open CMS
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Growth Rate</span>
                  </div>
                  <div className="text-2xl font-bold mt-2 text-green-600">+12.5%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Platform average</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Support Tickets</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 20) + 5}</div>
                  <p className="text-xs text-muted-foreground">Open tickets</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Certificates</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(platformStats.totalEnrollments * 0.3)}</div>
                  <p className="text-xs text-muted-foreground">Issued this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage platform users and permissions</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowAddUserModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.activeUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Instructors</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{getUsersByRole('instructor').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserX className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Suspended</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{getSuspendedUsers()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading users...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'instructor' ? 'secondary' : 'outline'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem
                                  className="text-orange-600"
                                  onClick={() => handleUserStatusToggle(user.id, user.status)}
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleUserStatusToggle(user.id, user.status)}
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleUserDelete(user.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Course Management</h2>
                <p className="text-muted-foreground">Oversee all platform courses and content</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Courses
                </Button>
                <Button asChild>
                  <Link to="/create-course">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Link>
                </Button>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Total Courses</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.totalCourses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Published</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.publishedCourses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Pending Review</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{courses.filter(c => c.status === 'draft').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.averageRating}</div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>Manage course content and approval status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading courses...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No courses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.slice(0, 10).map((course) => (
                        <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium line-clamp-1">{course.title}</div>
                              <div className="text-sm text-muted-foreground">${course.price}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{course.instructorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.category}</Badge>
                        </TableCell>
                        <TableCell>{course.totalStudents.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            course.status === 'published' ? 'default' :
                            course.status === 'draft' ? 'secondary' : 'outline'
                          }>
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/course/${course.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Course
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/edit-course/${course.id}`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Course
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {course.status === 'draft' && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleCourseStatusChange(course.id, 'published')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Course
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleCourseDelete(course.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Platform Analytics</h2>
                <p className="text-muted-foreground">Comprehensive platform performance metrics</p>
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
                  <CardTitle className="text-sm">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${(platformStats.totalRevenue * 0.1).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+15.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">New Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(platformStats.totalUsers * 0.2)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+8.7%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Course Completions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(platformStats.totalEnrollments * 0.3)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+12.1%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.floor(Math.random() * 500) + 200}
                  </div>
                  <p className="text-xs text-muted-foreground">Right now</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600">Live</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue and growth patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Revenue chart visualization</p>
                      <p className="text-xs text-muted-foreground">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>User registration and activity trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">User growth chart</p>
                      <p className="text-xs text-muted-foreground">Shows registration patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Content Moderation</h2>
                <p className="text-muted-foreground">Review and moderate platform content</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Flag className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Moderation Settings
                </Button>
              </div>
            </div>

            {/* Moderation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Flag className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Reported Content</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.reportedContent}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Pending Reviews</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{platformStats.pendingReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Resolved Today</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 10) + 5}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">High Priority</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 5) + 1}</div>
                </CardContent>
              </Card>
            </div>

            {/* Reported Content */}
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>Review flagged content and take appropriate action</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock reported content */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="font-medium">
                            {i === 0 ? 'Inappropriate course content' :
                             i === 1 ? 'Spam in discussion forum' :
                             i === 2 ? 'Offensive review comment' :
                             i === 3 ? 'Copyright violation' : 'Misleading course description'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {i < 2 ? 'Course' : i < 4 ? 'Review' : 'Discussion'}
                          </Badge>
                        </TableCell>
                        <TableCell>User {i + 1}</TableCell>
                        <TableCell>
                          {i === 0 ? 'Inappropriate content' :
                           i === 1 ? 'Spam' :
                           i === 2 ? 'Harassment' :
                           i === 3 ? 'Copyright' : 'Misleading info'}
                        </TableCell>
                        <TableCell>{new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={i < 2 ? 'destructive' : i < 4 ? 'default' : 'secondary'}>
                            {i < 2 ? 'High' : i < 4 ? 'Medium' : 'Low'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-orange-600">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Warn User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Remove Content
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">System Management</h2>
                <p className="text-muted-foreground">Monitor system health and manage platform settings</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <Link to="/cms">
                    <Edit className="w-4 h-4 mr-2" />
                    Content Management
                  </Link>
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  System Logs
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Server className="w-4 h-4" />
                    <span>Server Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Online</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uptime: {platformStats.serverUptime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Database</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Response: 12ms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <HardDrive className="w-4 h-4" />
                    <span>Storage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Progress value={platformStats.storageUsed} className="flex-1" />
                    <span className="text-sm">{platformStats.storageUsed}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    2.1TB / 3TB used
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Wifi className="w-4 h-4" />
                    <span>Bandwidth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Progress value={platformStats.bandwidthUsed} className="flex-1" />
                    <span className="text-sm">{platformStats.bandwidthUsed}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    450GB / 1TB used
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Real-time system performance data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={35} className="w-20" />
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={68} className="w-20" />
                      <span className="text-sm">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network I/O</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={42} className="w-20" />
                      <span className="text-sm">42%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disk I/O</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={28} className="w-20" />
                      <span className="text-sm">28%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent System Events</CardTitle>
                  <CardDescription>Latest system activities and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'info', message: 'Database backup completed successfully', time: '2 hours ago' },
                      { type: 'warning', message: 'High memory usage detected on server-2', time: '4 hours ago' },
                      { type: 'success', message: 'System update deployed successfully', time: '1 day ago' },
                      { type: 'info', message: 'New SSL certificate installed', time: '2 days ago' },
                      { type: 'error', message: 'Failed login attempt from suspicious IP', time: '3 days ago' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          event.type === 'success' ? 'bg-green-500' :
                          event.type === 'warning' ? 'bg-yellow-500' :
                          event.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Modal */}
      <UserFormModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        title="Add New User"
        submitText="Add User"
      />

      {/* Edit User Modal */}
      <UserFormModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        title="Edit User"
        submitText="Update User"
        initialData={selectedUser}
      />
    </div>
  );
};

export default AdminDashboard;