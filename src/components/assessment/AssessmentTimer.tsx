import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  duration?: number; // in minutes
  onTimeUp?: () => void;
  warningThreshold?: number; // in seconds (default: 5 minutes)
  showWarning?: boolean;
}

export default function AssessmentTimer({
  duration = 30,
  onTimeUp,
  warningThreshold = 300, // 5 minutes
  showWarning = true,
}: AssessmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    if (timeLeft <= warningThreshold) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, warningThreshold, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = duration * 60;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        isWarning
          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
          : 'bg-background border-muted-foreground/20 text-foreground'
      }`}
    >
      <Clock className={`h-5 w-5 ${isWarning ? 'text-yellow-600' : ''}`} />
      <div className="flex flex-col">
        <span
          className={`text-lg font-bold font-mono ${
            isWarning ? 'text-yellow-800' : ''
          }`}
        >
          {formatTime(timeLeft)}
        </span>
        {isWarning && showWarning && (
          <div className="flex items-center gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>Time running low!</span>
          </div>
        )}
      </div>
    </div>
  );
}
