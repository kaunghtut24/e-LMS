import React, { useState } from 'react';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SkillGap {
  skillName: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  gap: number; // difference
  priority: 'low' | 'medium' | 'high';
  recommendedCourses: number;
  estimatedHours: number;
  category: string;
}

interface SkillGapVisualizationProps {
  skills: SkillGap[];
  onSkillSelect?: (skill: SkillGap) => void;
  viewMode?: 'radar' | 'bar' | 'list';
}

export default function SkillGapVisualization({
  skills,
  onSkillSelect,
  viewMode = 'radar',
}: SkillGapVisualizationProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillGap | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGapSeverity = (gap: number) => {
    if (gap >= 60) return { label: 'Severe', color: 'text-red-700', bg: 'bg-red-50' };
    if (gap >= 40) return { label: 'Moderate', color: 'text-orange-700', bg: 'bg-orange-50' };
    if (gap >= 20) return { label: 'Mild', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    return { label: 'Minor', color: 'text-green-700', bg: 'bg-green-50' };
  };

  const handleSkillClick = (skill: SkillGap) => {
    setSelectedSkill(skill);
    onSkillSelect?.(skill);
  };

  const RadarChart = () => (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Grid circles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r={(i * 160) / 5}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
          />
        ))}

        {/* Grid lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="200"
            y1="200"
            x2={200 + 160 * Math.cos((angle * Math.PI) / 180)}
            y2={200 + 160 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeOpacity="0.1"
          />
        ))}

        {/* Skills */}
        {skills.map((skill, index) => {
          const angle = (index / skills.length) * 2 * Math.PI;
          const currentRadius = (skill.currentLevel / 100) * 160;
          const targetRadius = (skill.targetLevel / 100) * 160;

          const x = 200 + currentRadius * Math.cos(angle - Math.PI / 2);
          const y = 200 + currentRadius * Math.sin(angle - Math.PI / 2);
          const tx = 200 + targetRadius * Math.cos(angle - Math.PI / 2);
          const ty = 200 + targetRadius * Math.sin(angle - Math.PI / 2);

          return (
            <g key={skill.skillName}>
              {/* Target level line */}
              <line
                x1="200"
                y1="200"
                x2={tx}
                y2={ty}
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Current level point */}
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="currentColor"
                className={getPriorityColor(skill.priority).split(' ')[0]}
              />

              {/* Skill label */}
              <text
                x={200 + 175 * Math.cos(angle - Math.PI / 2)}
                y={200 + 175 * Math.sin(angle - Math.PI / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-foreground pointer-events-none"
              >
                {skill.skillName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-current" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-current" />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </div>
    </div>
  );

  const BarChart = () => (
    <div className="space-y-6">
      {skills.map((skill, index) => (
        <div key={skill.skillName} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{skill.skillName}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                  skill.priority
                )}`}
              >
                {skill.priority} priority
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Gap: {skill.gap}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Current: {skill.currentLevel}%</span>
              <span className="text-muted-foreground">Target: {skill.targetLevel}%</span>
            </div>
            <div className="relative h-6 bg-muted rounded overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-blue-500"
                style={{ width: `${skill.currentLevel}%` }}
              />
              <div
                className="absolute left-0 top-0 h-full border-r-2 border-dashed border-white"
                style={{ width: `${skill.targetLevel}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkillList = () => (
    <div className="space-y-4">
      {skills
        .sort((a, b) => b.gap - a.gap)
        .map((skill) => {
          const severity = getGapSeverity(skill.gap);
          const isSelected = selectedSkill?.skillName === skill.skillName;

          return (
            <div
              key={skill.skillName}
              onClick={() => handleSkillClick(skill)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{skill.skillName}</h3>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {skill.priority === 'high' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : skill.priority === 'low' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-yellow-600" />
                  )}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                      skill.priority
                    )}`}
                  >
                    {skill.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                  <p className="font-semibold text-foreground">{skill.currentLevel}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Level</p>
                  <p className="font-semibold text-foreground">{skill.targetLevel}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gap</p>
                  <p className={`font-semibold ${severity.color}`}>{skill.gap}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                  {severity.label} Gap
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{skill.recommendedCourses} courses</span>
                  <span>{skill.estimatedHours}h to close</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 bg-card border rounded-lg">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Skill Gaps Found!
        </h3>
        <p className="text-muted-foreground">
          Your skills are well-aligned with your goals. Great job!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Skill Gap Analysis
        </h2>
        <select
          value={viewMode}
          onChange={(e) => {/* Handle view mode change */}}
          className="px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="radar">Radar View</option>
          <option value="bar">Bar Chart</option>
          <option value="list">List View</option>
        </select>
      </div>

      {viewMode === 'radar' && <RadarChart />}
      {viewMode === 'bar' && <BarChart />}
      {viewMode === 'list' && <SkillList />}

      {selectedSkill && viewMode === 'list' && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Selected: {selectedSkill.skillName}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {selectedSkill.gap}% gap to close. Priority: {selectedSkill.priority}.
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
              View Recommendations
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">
              Start Learning Path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
