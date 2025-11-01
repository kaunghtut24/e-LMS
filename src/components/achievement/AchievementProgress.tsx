import React from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import type { Achievement } from '@/types/phase1-phase2';

interface AchievementProgressProps {
  achievement: Achievement;
  currentProgress: number;
  requiredProgress: number;
  isUnlocked: boolean;
  className?: string;
}

export default function AchievementProgress({
  achievement,
  currentProgress,
  requiredProgress,
  isUnlocked,
  className = '',
}: AchievementProgressProps) {
  const progressPercentage = Math.min((currentProgress / requiredProgress) * 100, 100);
  const isCompleted = currentProgress >= requiredProgress;

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-orange-600',
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-600';
  };

  const getProgressBarColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-400',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className={`bg-card border rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{achievement.name}</h3>
            {isUnlocked ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-muted-foreground">
          {isUnlocked ? 'Completed' : 'Progress'}
        </span>
        <span className={`font-medium ${isUnlocked ? 'text-green-600' : getRarityColor(achievement.rarity)}`}>
          {currentProgress} / {requiredProgress}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getProgressBarColor(achievement.rarity)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Completion Percentage */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>{Math.round(progressPercentage)}% complete</span>
        {!isUnlocked && (
          <span className={getRarityColor(achievement.rarity)}>
            {requiredProgress - currentProgress} to go
          </span>
        )}
      </div>

      {/* Achievement Details */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t">
        <span className="text-xs font-medium text-yellow-600">
          {achievement.points} points
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            achievement.rarity === 'legendary'
              ? 'bg-orange-100 text-orange-800'
              : achievement.rarity === 'epic'
              ? 'bg-purple-100 text-purple-800'
              : achievement.rarity === 'rare'
              ? 'bg-blue-100 text-blue-800'
              : achievement.rarity === 'uncommon'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
        </span>
      </div>
    </div>
  );
}
