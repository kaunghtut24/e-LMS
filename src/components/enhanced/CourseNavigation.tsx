import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  FileText,
  HelpCircle,
  BookOpen,
  Star,
  Download
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '../../lib/utils';
import { Course, Lesson, Progress as UserProgress } from '../../types';

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
  totalLessons: number;
  completedLessons: number;
}

interface CourseNavigationProps {
  course: Course;
  lessons: Lesson[];
  userProgress?: UserProgress;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  isEnrolled: boolean;
  className?: string;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  course,
  lessons,
  userProgress,
  currentLessonId,
  onLessonSelect,
  isEnrolled,
  className
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Group lessons into modules
  const modules: CourseModule[] = React.useMemo(() => {
    if (!lessons.length) return [];

    const moduleMap = new Map<string, CourseModule>();
    
    lessons.forEach((lesson, index) => {
      const moduleNumber = Math.floor(index / 5) + 1;
      const moduleId = `module-${moduleNumber}`;
      const moduleName = getModuleName(moduleNumber);

      if (!moduleMap.has(moduleId)) {
        moduleMap.set(moduleId, {
          id: moduleId,
          title: `Module ${moduleNumber}: ${moduleName}`,
          lessons: [],
          duration: '0m',
          totalLessons: 0,
          completedLessons: 0
        });
      }

      const module = moduleMap.get(moduleId)!;
      module.lessons.push(lesson);
      module.totalLessons++;
      
      // Count completed lessons
      if (userProgress?.lessonsCompleted.includes(lesson.id)) {
        module.completedLessons++;
      }
    });

    // Calculate module durations
    moduleMap.forEach((module) => {
      const totalMinutes = module.lessons.reduce((acc, lesson) => {
        const minutes = parseInt(lesson.duration.replace('m', '')) || 0;
        return acc + minutes;
      }, 0);
      module.duration = `${totalMinutes}m`;
    });

    return Array.from(moduleMap.values());
  }, [lessons, userProgress]);

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

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (lesson: Lesson) => {
    const isCompleted = userProgress?.lessonsCompleted.includes(lesson.id);
    const isCurrent = lesson.id === currentLessonId;
    const isLocked = !isEnrolled && !lesson.isPreview;

    if (isLocked) {
      return <Lock className="w-4 h-4 text-muted-foreground" />;
    }

    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    if (isCurrent) {
      return <PlayCircle className="w-4 h-4 text-primary" />;
    }

    switch (lesson.type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-green-500" />;
      case 'text':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-orange-500" />;
      default:
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const canAccessLesson = (lesson: Lesson) => {
    return isEnrolled || lesson.isPreview;
  };

  const getModuleProgress = (module: CourseModule) => {
    return module.totalLessons > 0 ? (module.completedLessons / module.totalLessons) * 100 : 0;
  };

  const overallProgress = userProgress?.progressPercentage || 0;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Course Content</CardTitle>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{userProgress?.lessonsCompleted.length || 0} of {lessons.length} lessons</span>
            <span>{course.duration}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-2">
          {modules.map((module) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleProgress = getModuleProgress(module);

            return (
              <Collapsible
                key={module.id}
                open={isExpanded}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left hover:bg-accent/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-sm truncate">{module.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {module.completedLessons}/{module.totalLessons}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {module.duration}
                        </span>
                        <span>{module.totalLessons} lessons</span>
                      </div>
                      <Progress value={moduleProgress} className="h-1 mt-2" />
                    </div>
                    <div className="ml-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-4 pb-2">
                  <div className="space-y-1">
                    {module.lessons.map((lesson, index) => {
                      const isCompleted = userProgress?.lessonsCompleted.includes(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;
                      const canAccess = canAccessLesson(lesson);

                      return (
                        <Button
                          key={lesson.id}
                          variant="ghost"
                          onClick={() => canAccess && onLessonSelect(lesson.id)}
                          disabled={!canAccess}
                          className={cn(
                            "w-full justify-start p-3 h-auto text-left hover:bg-accent/50",
                            isCurrent && "bg-accent border-l-2 border-primary",
                            !canAccess && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <div className="flex-shrink-0 mt-0.5">
                              {getLessonIcon(lesson)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-medium truncate">
                                  {index + 1}. {lesson.title}
                                </h4>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {lesson.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                </div>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Download className="w-3 h-3 mr-1" />
                                    <span>{lesson.resources.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Course Completion */}
        {overallProgress === 100 && (
          <div className="p-4 mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-300">
              <Star className="w-5 h-5" />
              <span className="font-medium">Course Completed!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Congratulations! You've completed all lessons in this course.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseNavigation;
