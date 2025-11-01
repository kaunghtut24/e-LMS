import React from 'react';
import { BookOpen, Clock, Star, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  thumbnail?: string;
  price: number;
  matchScore: number; // 0-100
}

interface Recommendation {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
  recommendedCourses: Course[];
  estimatedTimeToClose: number; // in hours
  learningPath?: {
    id: string;
    name: string;
    steps: number;
  };
}

interface GapRecommendationProps {
  recommendations: Recommendation[];
  onEnroll?: (courseId: string) => void;
  onStartPath?: (pathId: string) => void;
  onViewCourse?: (courseId: string) => void;
}

export default function GapRecommendation({
  recommendations,
  onEnroll,
  onStartPath,
  onViewCourse,
}: GapRecommendationProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          icon: 'text-red-600',
        };
      case 'medium':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
        };
      case 'low':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          icon: 'text-green-600',
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
        };
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-card border rounded-lg">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Recommendations Yet
        </h3>
        <p className="text-muted-foreground">
          Complete a skill assessment to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map((rec) => {
        const styles = getPriorityStyles(rec.priority);

        return (
          <div
            key={rec.skillName}
            className={`bg-card border rounded-lg p-6 ${styles.border}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {rec.skillName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Current: <strong>{rec.currentLevel}%</strong>
                  </span>
                  <span>
                    Target: <strong>{rec.targetLevel}%</strong>
                  </span>
                  <span>
                    Gap: <strong className={styles.icon}>{rec.gap}%</strong>
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${styles.bg} ${styles.icon}`}
                  >
                    {rec.priority} priority
                  </span>
                </div>
              </div>

              {rec.learningPath && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Recommended Path</p>
                  <p className="font-semibold text-foreground">{rec.learningPath.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rec.learningPath.steps} steps
                  </p>
                </div>
              )}
            </div>

            {/* Progress to Goal */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Progress to Goal
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{rec.estimatedTimeToClose}h to close gap</span>
                </div>
              </div>
              <Progress value={rec.currentLevel} className="h-3" />
            </div>

            {/* Learning Path CTA */}
            {rec.learningPath && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {rec.learningPath.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A structured learning path to master {rec.skillName}
                    </p>
                  </div>
                  <Button onClick={() => onStartPath?.(rec.learningPath!.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Path
                  </Button>
                </div>
              </div>
            )}

            {/* Recommended Courses */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Recommended Courses
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rec.recommendedCourses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-foreground line-clamp-2">
                          {course.title}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                            course.difficulty
                          )}`}
                        >
                          {course.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          Match: {course.matchScore}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          ${course.price}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewCourse?.(course.id)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onEnroll?.(course.id)}
                          >
                            Enroll
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {rec.recommendedCourses.length > 4 && (
                <div className="mt-4 text-center">
                  <button className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
                    View {rec.recommendedCourses.length - 4} more courses
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline">
                Save for Later
              </Button>
              <Button>
                Start Learning Now
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
