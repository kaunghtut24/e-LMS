import React from 'react';
import { CheckCircle, XCircle, Clock, Award, TrendingUp, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { AssessmentResults } from './PreAssessmentTaker';

interface AssessmentResultsProps {
  results: AssessmentResults;
  onViewDetails?: () => void;
  onContinue?: () => void;
}

export default function AssessmentResults({
  results,
  onViewDetails,
  onContinue,
}: AssessmentResultsProps) {
  const percentage = Math.round((results.score / results.totalPoints) * 100);
  const timeSpentMinutes = Math.floor(results.timeSpent / 60);
  const timeSpentSeconds = results.timeSpent % 60;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const badge = getScoreBadge(percentage);

  return (
    <div className="bg-card border rounded-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Award className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Assessment Complete!
        </h1>
        <p className="text-muted-foreground">
          Here are your results and recommendations
        </p>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Your Score</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-end gap-4 mb-2">
              <span className={`text-5xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </span>
              <div className="pb-2">
                <p className="text-muted-foreground">
                  {results.score} out of {results.totalPoints} points
                </p>
              </div>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Time Spent
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {timeSpentMinutes}m {timeSpentSeconds}s
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Correct
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((results.score / results.totalPoints) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Skill Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results.skillScores).map(([skill, score]) => {
            const skillPercentage = Math.round((score.correct / score.total) * 100);
            return (
              <div key={skill} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{skill}</h4>
                  <span
                    className={`text-sm font-medium ${
                      skillPercentage >= 70
                        ? 'text-green-600'
                        : skillPercentage >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {skillPercentage}%
                  </span>
                </div>
                <Progress value={skillPercentage} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {score.correct} out of {score.total} correct
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Recommendations
        </h3>
        <div className="space-y-3">
          {percentage >= 80 && (
            <p className="text-blue-800">
              🎉 <strong>Excellent work!</strong> You have strong knowledge in this area. Consider
              exploring advanced topics or mentoring others.
            </p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-blue-800">
              ✅ <strong>Good job!</strong> You have a solid foundation. Review the questions you
              missed and consider taking some intermediate courses.
            </p>
          )}
          {percentage >= 40 && percentage < 60 && (
            <p className="text-blue-800">
              📚 <strong>Keep learning!</strong> You have a basic understanding but need more
              practice. We recommend starting with beginner-level courses.
            </p>
          )}
          {percentage < 40 && (
            <p className="text-blue-800">
              💪 <strong>Don't give up!</strong> Everyone starts somewhere. Begin with fundamental
              courses and practice regularly. You've got this!
            </p>
          )}

          {/* Skill-specific recommendations */}
          {Object.entries(results.skillScores).map(([skill, score]) => {
            const skillPercentage = Math.round((score.correct / score.total) * 100);
            if (skillPercentage < 70) {
              return (
                <div key={skill} className="text-blue-800">
                  • <strong>{skill}:</strong> Review core concepts and take beginner courses to
                  strengthen your foundation
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            View Detailed Results
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Learning
          </button>
        )}
      </div>
    </div>
  );
}
