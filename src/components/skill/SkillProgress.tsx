import React from 'react';
import { TrendingUp, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SkillProgressData {
  skillName: string;
  currentLevel: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100
  coursesCompleted: number;
  totalCourses: number;
  endorsements: number;
  projects: number;
  timeSpent: number; // in hours
}

interface SkillProgressProps {
  skills: SkillProgressData[];
  showAll?: boolean;
  className?: string;
}

export default function SkillProgress({
  skills,
  showAll = false,
  className = '',
}: SkillProgressProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      none: 'text-muted-foreground',
      beginner: 'text-blue-600',
      intermediate: 'text-green-600',
      advanced: 'text-purple-600',
      expert: 'text-orange-600',
    };
    return colors[level as keyof typeof colors] || 'text-muted-foreground';
  };

  const getLevelBadgeColor = (level: string) => {
    const colors = {
      none: 'bg-gray-100 text-gray-800',
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-green-100 text-green-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-orange-100 text-orange-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProgressBarColor = (level: string) => {
    const colors = {
      none: 'bg-gray-400',
      beginner: 'bg-blue-500',
      intermediate: 'bg-green-500',
      advanced: 'bg-purple-500',
      expert: 'bg-orange-500',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-400';
  };

  const displaySkills = showAll ? skills : skills.slice(0, 6);

  if (displaySkills.length === 0) {
    return (
      <div className={`bg-card border rounded-lg p-8 text-center ${className}`}>
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Skills Yet</h3>
        <p className="text-muted-foreground">
          Start learning to build your skill profile!
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Skill Progress</h2>
      </div>

      <div className="space-y-6">
        {displaySkills.map((skill) => (
          <div key={skill.skillName} className="space-y-3">
            {/* Skill Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{skill.skillName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">Current:</span>
                  <span className={`text-sm font-medium ${getLevelColor(skill.currentLevel)}`}>
                    {skill.currentLevel.charAt(0).toUpperCase() + skill.currentLevel.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="text-sm font-medium text-primary">
                    Target: {skill.targetLevel.charAt(0).toUpperCase() + skill.targetLevel.slice(1)}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(skill.currentLevel)}`}>
                {skill.currentLevel.charAt(0).toUpperCase() + skill.currentLevel.slice(1)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to next level</span>
                <span className="font-medium text-foreground">{Math.round(skill.progress)}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" />
            </div>

            {/* Skill Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="text-sm font-semibold text-foreground">
                    {skill.coursesCompleted}/{skill.totalCourses}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Endorsements</p>
                  <p className="text-sm font-semibold text-foreground">{skill.endorsements}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Projects</p>
                  <p className="text-sm font-semibold text-foreground">{skill.projects}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Time Spent</p>
                  <p className="text-sm font-semibold text-foreground">{skill.timeSpent}h</p>
                </div>
              </div>
            </div>

            {/* Level Up Suggestion */}
            {skill.progress < 100 && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Next:</strong> Complete {Math.ceil((skill.totalCourses - skill.coursesCompleted) * (100 - skill.progress) / 100)} more courses to advance to {skill.targetLevel}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && skills.length > 6 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
            Show {skills.length - 6} more skills
          </button>
        </div>
      )}
    </div>
  );
}
