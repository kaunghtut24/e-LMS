import React, { useEffect, useState } from 'react';
import { X, Trophy, Star } from 'lucide-react';
import type { Achievement } from '@/types/phase1-phase2';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
  duration?: number;
}

export default function AchievementNotification({
  achievement,
  onClose,
  duration = 5000,
}: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      setProgress(100);

      // Animate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [achievement, duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getRarityGradient = (rarity: string) => {
    const gradients = {
      common: 'from-gray-400 to-gray-600',
      uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-orange-400 to-orange-600',
    };
    return gradients[rarity as keyof typeof gradients] || gradients.common;
  };

  if (!achievement || !visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div
        className={`
          bg-card border-2 rounded-lg shadow-2xl p-4 max-w-sm
          transform transition-all duration-500
          ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
        style={{
          borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(achievement.rarity)} opacity-10 rounded-lg`} />

        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getRarityGradient(
              achievement.rarity
            )} rounded-full flex items-center justify-center`}
          >
            <Trophy className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-primary">Achievement Unlocked!</h4>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>

            <h3 className="text-lg font-bold text-foreground">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {achievement.description}
            </p>

            {/* Points */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold text-yellow-600">
                +{achievement.points} points
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

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getRarityGradient(achievement.rarity)} transition-all duration-100`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
