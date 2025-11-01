import React from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

export default function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  color = 'rgb(59, 130, 246)',
  backgroundColor = 'rgb(229, 231, 235)',
  showPercentage = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {showPercentage && (
            <div className="text-2xl font-bold text-foreground">
              {value}%
            </div>
          )}
          {label && (
            <div className="text-xs font-medium text-foreground mt-1">
              {label}
            </div>
          )}
          {sublabel && (
            <div className="text-xs text-muted-foreground">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
