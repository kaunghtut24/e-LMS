import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  Download,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  Globe,
  Calendar,
  TrendingUp,
  Target,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    courses,
    getCourseById,
    getCourseLessons,
    getCourseReviews,
    getUserProgress,
    enrollInCourse
  } = useDataStore();

  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Find course by slug
  const course = useMemo(() => {
    return courses.find(c => c.slug === courseSlug);
  }, [courses, courseSlug]);

  // Get course lessons
  const lessons = useMemo(() => {
    return course ? getCourseLessons(course.id) : [];
  }, [course, getCourseLessons]);

  // Get course reviews
  const reviews = useMemo(() => {
    return course ? getCourseReviews(course.id) : [];
  }, [course, getCourseReviews]);

  // Get user progress if enrolled
  const userProgress = useMemo(() => {
    return user && course ? getUserProgress(user.id, course.id) : null;
  }, [user, course, getUserProgress]);

  // Check if user is enrolled
  const isEnrolled = !!userProgress;

  // Helper function to get module names
  const getModuleName = (moduleNumber: number) => {
    const names = [
      'Getting Started',
      'Core Concepts',
      'Advanced Topics',
      'Practical Applications',
      'Best Practices',
      'Real-world Projects'
    ];
    return names[moduleNumber - 1] || `Advanced Module ${moduleNumber}`;
  };

  // Group lessons by modules (mock module structure)
  const modules = useMemo(() => {
    if (!lessons.length) return [];

    // Create mock modules based on lesson order
    const moduleMap = new Map();
    lessons.forEach((lesson, index) => {
      const moduleNumber = Math.floor(index / 5) + 1;
      const moduleId = `module-${moduleNumber}`;
      const moduleName = `Module ${moduleNumber}: ${getModuleName(moduleNumber)}`;

      if (!moduleMap.has(moduleId)) {
        moduleMap.set(moduleId, {
          id: moduleId,
          title: moduleName,
          lessons: [],
          duration: '0m',
          totalLessons: 0
        });
      }

      moduleMap.get(moduleId).lessons.push(lesson);
      moduleMap.get(moduleId).totalLessons++;
    });

    return Array.from(moduleMap.values());
  }, [lessons]);



  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to enroll in courses');
      navigate('/login');
      return;
    }

    if (!user || !course) return;

    try {
      enrollInCourse(user.id, course.id);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const formatDuration = (duration: string) => {
    // Convert duration like "2h 30m" to readable format
    return duration.replace(/(\d+)h/, '$1 hours').replace(/(\d+)m/, '$1 minutes');
  };

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

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {course.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-blue-100 mb-6">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(course.rating)}
                  </div>
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.totalStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="mt-6 flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/images/avatars/instructor1.jpg" />
                  <AvatarFallback>{course.instructorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Created by {course.instructorName}</p>
                  <p className="text-sm text-white/80">
                    Last updated {new Date(course.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Preview & Enrollment */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur border-white/20 shadow-xl">
                <CardContent className="p-6">
                  {/* Course Thumbnail */}
                  <div className="relative mb-6">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur">
                        <Play className="w-6 h-6 mr-2" />
                        Preview Course
                      </Button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-3xl font-bold">
                        ${course.price}
                      </span>
                      {course.originalPrice > course.price && (
                        <span className="text-lg text-white/60 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    {course.originalPrice > course.price && (
                      <Badge variant="destructive">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  {isEnrolled ? (
                    <div className="space-y-3">
                      <Button size="lg" className="w-full" asChild>
                        <Link to={`/courses/${course.slug}/lesson/${lessons[0]?.id || ''}`}>
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                      <div className="text-center">
                        <p className="text-sm text-white/80 mb-2">Your Progress</p>
                        <Progress value={userProgress?.progressPercentage || 0} className="mb-2" />
                        <p className="text-sm text-white/80">
                          {userProgress?.progressPercentage || 0}% Complete
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button size="lg" className="w-full" onClick={handleEnrollment}>
                        <BookOpen className="w-5 h-5 mr-2" />
                        Enroll Now
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-white/10 border-white/20 hover:bg-white/20">
                          <Heart className="w-4 h-4 mr-2" />
                          Wishlist
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-white/10 border-white/20 hover:bg-white/20">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Course Features */}
                  <div className="mt-6 space-y-3 text-sm text-white/90">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mobile and desktop access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{course.longDescription}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Course Content</h3>
                  <div className="text-sm text-muted-foreground">
                    {modules.length} modules • {lessons.length} lessons • {formatDuration(course.duration)}
                  </div>
                </div>

                {modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{module.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {module.totalLessons} lessons
                          </span>
                          {expandedModule === module.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {expandedModule === module.id && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="flex-shrink-0">
                                {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-500" />}
                                {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-green-500" />}
                                {lesson.type === 'text' && <FileText className="w-4 h-4 text-purple-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">{lesson.title}</h4>
                                <p className="text-xs text-muted-foreground">{lesson.description}</p>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">Preview</Badge>
                                )}
                                {isEnrolled && userProgress?.lessonsCompleted.includes(lesson.id) && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/images/avatars/instructor1.jpg" />
                        <AvatarFallback className="text-lg">
                          {course.instructorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{course.instructorName}</h3>
                        <p className="text-muted-foreground mb-4">
                          Senior Software Engineer & Educator
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">4.8</div>
                            <div className="text-xs text-muted-foreground">Instructor Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">1,234</div>
                            <div className="text-xs text-muted-foreground">Reviews</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">45,678</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">12</div>
                            <div className="text-xs text-muted-foreground">Courses</div>
                          </div>
                        </div>

                        <div className="prose prose-sm max-w-none">
                          <p>
                            Dr. Michael Chen is a seasoned software engineer with over 10 years of experience
                            in full-stack development. He has worked at top tech companies including Google and
                            Microsoft, and has been teaching programming for the past 5 years.
                          </p>
                          <p>
                            His expertise spans across modern web technologies, cloud computing, and software
                            architecture. He's passionate about making complex programming concepts accessible
                            to learners of all levels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {course.totalReviews} reviews for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Rating Summary */}
                    <div className="flex items-center space-x-8 mb-6 p-4 bg-accent/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{course.rating}</div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {renderStars(course.rating)}
                        </div>
                        <div className="text-sm text-muted-foreground">Course Rating</div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = Math.floor(Math.random() * 100); // Mock data
                            const percentage = (count / course.totalReviews) * 100;
                            return (
                              <div key={stars} className="flex items-center space-x-2">
                                <span className="text-sm w-8">{stars}★</span>
                                <Progress value={percentage} className="flex-1" />
                                <span className="text-sm text-muted-foreground w-12">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>
                                {review.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{review.userName}</h4>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <h5 className="font-medium mb-2">{review.title}</h5>
                              <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <button className="hover:text-foreground transition-colors">
                                  👍 Helpful ({review.helpful})
                                </button>
                                <button className="hover:text-foreground transition-colors">
                                  Report
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {reviews.length > 5 && (
                      <div className="text-center mt-6">
                        <Button variant="outline">Load More Reviews</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Course Info & Related */}
          <div className="space-y-6">
            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Skill Level</span>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students Enrolled</span>
                  <span className="font-medium">{course.totalStudents.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Languages</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {new Date(course.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>This course includes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Students also bought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses
                  .filter(c => c.id !== course.id && c.category === course.category)
                  .slice(0, 3)
                  .map((relatedCourse) => (
                    <Link key={relatedCourse.id} to={`/courses/${relatedCourse.slug}`}>
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <img
                          src={relatedCourse.thumbnail}
                          alt={relatedCourse.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedCourse.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {relatedCourse.instructorName}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{relatedCourse.rating}</span>
                            </div>
                            <span className="text-sm font-bold">${relatedCourse.price}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;