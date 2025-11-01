import React from 'react';
import { Trophy, Star, Award, Zap, Target, Crown } from 'lucide-react';
import type { Achievement } from '@/types/phase1-phase2';

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  progress?: number;
  earnedAt?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function AchievementBadge({
  achievement,
  earned = false,
  progress = 0,
  earnedAt,
  showDetails = true,
  size = 'md',
  onClick,
}: AchievementBadgeProps) {
  const getRarityStyles = (rarity: string) => {
    const styles = {
      common: {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        glow: 'shadow-gray-300/50',
        iconColor: 'text-gray-600',
        textColor: 'text-gray-700',
      },
      uncommon: {
        bg: 'bg-green-100',
        border: 'border-green-400',
        glow: 'shadow-green-400/50',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
      },
      rare: {
        bg: 'bg-blue-100',
        border: 'border-blue-400',
        glow: 'shadow-blue-400/50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700',
      },
      epic: {
        bg: 'bg-purple-100',
        border: 'border-purple-400',
        glow: 'shadow-purple-400/50',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700',
      },
      legendary: {
        bg: 'bg-orange-100',
        border: 'border-orange-400',
        glow: 'shadow-orange-400/50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700',
      },
    };
    return styles[rarity as keyof typeof styles] || styles.common;
  };

  const getIcon = (type: string) => {
    const iconClass = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
    const iconWrapperClass = size === 'sm' ? 'p-2' : size === 'lg' ? 'p-4' : 'p-3';

    const baseClasses = `${iconClass} ${getRarityStyles(achievement.rarity).iconColor}`;

    switch (type) {
      case 'course_completion':
        return <Trophy className={`${iconClass}`} />;
      case 'skill_mastery':
        return <Star className={`${iconClass}`} />;
      case 'project_submission':
        return <Award className={`${iconClass}`} />;
      case 'streak':
        return <Zap className={`${iconClass}`} />;
      case 'collaboration':
        return <Target className={`${iconClass}`} />;
      default:
        return <Crown className={`${iconClass}`} />;
    }
  };

  const rarityStyles = getRarityStyles(achievement.rarity);
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const containerClasses = `
    ${sizeClasses[size]}
    ${earned ? rarityStyles.bg : 'bg-muted'}
    ${earned ? `border-2 ${rarityStyles.border}` : 'border border-muted-foreground/20'}
    rounded-full
    ${earned ? `shadow-lg ${rarityStyles.glow}` : ''}
    flex items-center justify-center
    ${onClick ? 'cursor-pointer hover:scale-105' : ''}
    transition-all duration-200
    ${earned ? 'relative' : 'opacity-60'}
  `;

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      title={
        earned
          ? `${achievement.name} - ${achievement.description}`
          : `Locked: ${achievement.name}`
      }
    >
      {/* Icon */}
      <div className={earned ? 'text-current' : 'text-muted-foreground'}>
        {getIcon(achievement.type)}
      </div>

      {/* Progress Ring (for earned but with progress) */}
      {earned && progress > 0 && progress < 100 && (
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="text-primary"
          />
        </svg>
      )}

      {/* Rarity Indicator */}
      {achievement.rarity === 'legendary' && earned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <Crown className="h-4 w-4 text-yellow-800" />
        </div>
      )}

      {/* Show details below */}
      {showDetails && (
        <div className="mt-3 text-center">
          <h4 className={`text-sm font-semibold ${earned ? rarityStyles.textColor : 'text-muted-foreground'}`}>
            {achievement.name}
          </h4>
          {!earned && (
            <p className="text-xs text-muted-foreground mt-1">
              {achievement.points} points
            </p>
          )}
          {earned && earnedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
