import React from 'react';
import { Play, Clock, Users, Star, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  targetSkills: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  enrollmentCount: number;
  rating: number;
  isActive: boolean;
  isTemplate: boolean;
  progress?: number; // 0-100
  completedSteps?: number;
  totalSteps?: number;
  thumbnail?: string;
}

interface LearningPathCardProps {
  path: LearningPath;
  onStart?: (pathId: string) => void;
  onContinue?: (pathId: string) => void;
  onViewDetails?: (pathId: string) => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function LearningPathCard({
  path,
  onStart,
  onContinue,
  onViewDetails,
  variant = 'default',
}: LearningPathCardProps) {
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

  const isInProgress = path.progress !== undefined && path.progress > 0 && path.progress < 100;
  const isCompleted = path.progress === 100;

  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div className="w-32 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
          {path.thumbnail ? (
            <img
              src={path.thumbnail}
              alt={path.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{path.title}</h3>
              <p className="text-sm text-muted-foreground">{path.targetRole}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                path.difficultyLevel
              )}`}
            >
              {path.difficultyLevel}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimatedDuration}h
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {path.enrollmentCount}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {path.rating.toFixed(1)}
            </span>
          </div>

          {path.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {path.completedSteps}/{path.totalSteps} steps completed
                </span>
                <span className="font-medium text-foreground">{path.progress}%</span>
              </div>
              <Progress value={path.progress} className="h-1.5" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Button onClick={() => onViewDetails?.(path.id)} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          ) : isInProgress ? (
            <Button onClick={() => onContinue?.(path.id)}>
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
          ) : (
            <Button onClick={() => onStart?.(path.id)}>
              <Play className="h-4 w-4 mr-2" />
              Start Path
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onViewDetails?.(path.id)}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{path.title}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
              path.difficultyLevel
            )}`}
          >
            {path.difficultyLevel}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {path.estimatedDuration}h
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {path.rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted">
        {path.thumbnail ? (
          <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">{path.title}</h3>
            <p className="text-sm text-muted-foreground">{path.targetRole}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              path.difficultyLevel
            )}`}
          >
            {path.difficultyLevel}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {path.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {path.targetSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {path.targetSkills.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              +{path.targetSkills.length - 3} more
            </span>
          )}
        </div>

        {/* Progress (if in progress) */}
        {path.progress !== undefined && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {path.completedSteps}/{path.totalSteps} steps completed
              </span>
              <span className="font-medium text-foreground">{path.progress}%</span>
            </div>
            <Progress value={path.progress} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {path.estimatedDuration}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {path.enrollmentCount}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {path.rating.toFixed(1)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Button onClick={() => onViewDetails?.(path.id)} variant="outline" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          ) : isInProgress ? (
            <Button onClick={() => onContinue?.(path.id)} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
          ) : (
            <Button onClick={() => onStart?.(path.id)} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Path
            </Button>
          )}
          <Button onClick={() => onViewDetails?.(path.id)} variant="outline">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
