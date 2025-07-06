import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  BookOpen,
  FileText,
  Download,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  PenTool,
  Save,
  X,
  Menu,
  List,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { toast } from 'sonner';
import EnhancedVideoPlayer from '../components/enhanced/EnhancedVideoPlayer';
import CourseNavigation from '../components/enhanced/CourseNavigation';
import EnhancedNoteTaking from '../components/enhanced/EnhancedNoteTaking';

const LessonPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    courses,
    lessons,
    getCourseById,
    getCourseLessons,
    getUserProgress,
    updateProgress,
    addNote,
    addBookmark,
    removeBookmark
  } = useDataStore();

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1800); // 30 minutes mock duration
  const [volume, setVolume] = useState(75);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // UI state
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Find course and lesson
  const course = useMemo(() => {
    return courses.find(c => c.slug === courseSlug);
  }, [courses, courseSlug]);

  const currentLesson = useMemo(() => {
    return lessons.find(l => l.id === lessonId);
  }, [lessons, lessonId]);

  const courseLessons = useMemo(() => {
    return course ? getCourseLessons(course.id) : [];
  }, [course, getCourseLessons]);

  const userProgress = useMemo(() => {
    return user && course ? getUserProgress(user.id, course.id) : null;
  }, [user, course, getUserProgress]);

  // Find current lesson index for navigation
  const currentLessonIndex = useMemo(() => {
    return courseLessons.findIndex(l => l.id === lessonId);
  }, [courseLessons, lessonId]);

  const previousLesson = currentLessonIndex > 0 ? courseLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < courseLessons.length - 1 ? courseLessons[currentLessonIndex + 1] : null;

  // Update bookmark state when userProgress changes
  useEffect(() => {
    setIsBookmarked(userProgress?.bookmarks.includes(lessonId || '') || false);
  }, [userProgress, lessonId]);

  // Get lesson notes
  const lessonNotes = useMemo(() => {
    return userProgress?.notes.filter(note => note.lessonId === lessonId) || [];
  }, [userProgress, lessonId]);

  // Mock video progress tracking
  useEffect(() => {
    if (isPlaying && currentLesson && user && course) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Mark lesson as completed when 90% watched
          if (newTime / duration > 0.9 && !userProgress?.lessonsCompleted.includes(currentLesson.id)) {
            updateProgress(user.id, course.id, currentLesson.id);
            toast.success('Lesson completed! 🎉');
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentLesson, user, course, duration, userProgress, updateProgress]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleBookmark = () => {
    if (currentLesson && user && course) {
      if (isBookmarked) {
        removeBookmark(user.id, course.id, currentLesson.id);
      } else {
        addBookmark(user.id, course.id, currentLesson.id);
      }
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleFullscreen = () => {
    // Fullscreen implementation would go here
    console.log('Toggle fullscreen');
  };



  const handleAddNote = () => {
    if (!user || !course || !currentLesson || !noteContent.trim()) return;

    addNote(user.id, course.id, currentLesson.id, noteContent.trim());
    setNoteContent('');
    setIsAddingNote(false);
    toast.success('Note added');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-green-500" />;
      case 'text':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The lesson you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courses/${course.slug}`}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Course
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold text-sm truncate max-w-[300px]">
                {currentLesson.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                {course.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? 'text-yellow-500' : ''}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video/Content Area */}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:mr-80' : ''}`}>
          {/* Enhanced Video Player */}
          {currentLesson.type === 'video' && (
            <EnhancedVideoPlayer
              title={currentLesson.title}
              duration={duration}
              currentTime={currentTime}
              isPlaying={isPlaying}
              volume={volume}
              playbackSpeed={playbackSpeed}
              isBookmarked={isBookmarked}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onSpeedChange={handleSpeedChange}
              onBookmark={handleBookmark}
              onFullscreen={handleFullscreen}
              className="w-full"
            />
          )}

          {/* Text/Quiz Content */}
          {currentLesson.type !== 'video' && (
            <div className="flex-1 p-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getLessonIcon(currentLesson.type)}
                    <CardTitle>{currentLesson.title}</CardTitle>
                  </div>
                  <CardDescription>{currentLesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentLesson.type === 'text' && (
                    <div className="prose prose-sm max-w-none">
                      <p>{currentLesson.transcript || 'Lesson content would be displayed here...'}</p>
                    </div>
                  )}
                  {currentLesson.type === 'quiz' && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Interactive quiz content would be displayed here...
                      </p>
                      <Button>Start Quiz</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lesson Navigation */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                {previousLesson ? (
                  <Button variant="outline" asChild>
                    <Link to={`/courses/${course.slug}/lesson/${previousLesson.id}`}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous: {previousLesson.title}
                    </Link>
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {courseLessons.length}
                </p>
                <Progress
                  value={((currentLessonIndex + 1) / courseLessons.length) * 100}
                  className="w-32 mx-auto mt-2"
                />
              </div>
              <div>
                {nextLesson ? (
                  <Button asChild>
                    <Link to={`/courses/${course.slug}/lesson/${nextLesson.id}`}>
                      Next: {nextLesson.title}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={`/courses/${course.slug}`}>
                      Complete Course
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed right-0 top-[73px] bottom-0 w-80 bg-background border-l overflow-y-auto">
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                  <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
                  <TabsTrigger value="playlist" className="text-xs">Playlist</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Lesson Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{currentLesson.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline" className="text-xs">
                          {currentLesson.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        {userProgress?.lessonsCompleted.includes(currentLesson.id) ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {currentLesson.transcript && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Transcript</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                          {currentLesson.transcript}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">My Notes</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingNote(true)}
                    >
                      <PenTool className="w-3 h-3 mr-1" />
                      Add Note
                    </Button>
                  </div>

                  {isAddingNote && (
                    <Card>
                      <CardContent className="p-4">
                        <Textarea
                          placeholder="Add your note here..."
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          className="mb-3"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddNote}>
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsAddingNote(false);
                              setNoteContent('');
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {lessonNotes.length > 0 ? (
                      lessonNotes.map((note, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <p className="text-sm mb-2">{note.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(note.timestamp).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <PenTool className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notes yet</p>
                        <p className="text-xs text-muted-foreground">
                          Add notes to remember key points
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-4 mt-4">
                  <h3 className="text-sm font-medium">Lesson Resources</h3>

                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{resource.title}</p>
                                  <p className="text-xs text-muted-foreground uppercase">
                                    {resource.type}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No resources available</p>
                    </div>
                  )}
                </TabsContent>

                {/* Playlist Tab */}
                <TabsContent value="playlist" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Course Lessons</h3>
                    <span className="text-xs text-muted-foreground">
                      {currentLessonIndex + 1}/{courseLessons.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {courseLessons.map((lesson, index) => (
                      <Link
                        key={lesson.id}
                        to={`/courses/${course.slug}/lesson/${lesson.id}`}
                        className={`block p-3 rounded-lg border transition-colors ${
                          lesson.id === currentLesson.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2">
                              {index + 1}. {lesson.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                              {userProgress?.lessonsCompleted.includes(lesson.id) && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              )}
                              {userProgress?.bookmarks.includes(lesson.id) && (
                                <BookmarkCheck className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;