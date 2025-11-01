import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PathStep {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'assessment' | 'project' | 'reading';
  courseId?: string;
  assessmentId?: string;
  estimatedHours: number;
  prerequisites: string[]; // step IDs
  order: number;
  isOptional: boolean;
}

interface LearningPath {
  id?: string;
  title: string;
  description: string;
  targetRole: string;
  targetSkills: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // total hours
  steps: PathStep[];
  isTemplate: boolean;
  isActive: boolean;
}

interface LearningPathBuilderProps {
  initialData?: LearningPath;
  onSave: (path: LearningPath) => void;
}

export default function LearningPathBuilder({
  initialData,
  onSave,
}: LearningPathBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [targetRole, setTargetRole] = useState(initialData?.targetRole || '');
  const [targetSkills, setTargetSkills] = useState<string[]>(
    initialData?.targetSkills || []
  );
  const [currentSkill, setCurrentSkill] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    initialData?.difficultyLevel || 'beginner'
  );
  const [steps, setSteps] = useState<PathStep[]>(
    initialData?.steps || []
  );
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const pathTypes = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const stepTypes = [
    { value: 'course', label: 'Course' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'project', label: 'Project' },
    { value: 'reading', label: 'Reading Material' },
  ];

  const addStep = () => {
    const newStep: PathStep = {
      id: `step_${Date.now()}`,
      title: '',
      description: '',
      type: 'course',
      estimatedHours: 0,
      prerequisites: [],
      order: steps.length,
      isOptional: false,
    };
    setSteps([...steps, newStep]);
    setExpandedStep(newStep.id);
  };

  const updateStep = (id: string, updates: Partial<PathStep>) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    if (expandedStep === id) {
      setExpandedStep(null);
    }
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.id === id);
    if (index === -1) return;

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= steps.length) return;

    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];

    // Update order
    newSteps.forEach((step, i) => {
      step.order = i;
    });

    setSteps(newSteps);
  };

  const addSkill = () => {
    const skill = currentSkill.trim().toLowerCase();
    if (skill && !targetSkills.includes(skill)) {
      setTargetSkills([...targetSkills, skill]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setTargetSkills(targetSkills.filter((s) => s !== skill));
  };

  const calculateTotalDuration = () => {
    return steps.reduce((total, step) => total + step.estimatedHours, 0);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a path title');
      return;
    }
    if (steps.length === 0) {
      toast.error('Please add at least one step');
      return;
    }
    if (targetSkills.length === 0) {
      toast.error('Please add at least one target skill');
      return;
    }

    const path: LearningPath = {
      title: title.trim(),
      description: description.trim(),
      targetRole: targetRole.trim(),
      targetSkills,
      difficultyLevel,
      estimatedDuration: calculateTotalDuration(),
      steps,
      isTemplate: true,
      isActive: true,
    };

    onSave(path);
    toast.success('Learning path saved successfully!');
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Learning Path Builder
        </h2>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Path
        </Button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Path Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Frontend Developer Roadmap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Frontend Developer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Describe what learners will achieve..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Difficulty Level
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) =>
                setDifficultyLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')
              }
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {pathTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Estimated Duration
            </label>
            <input
              type="text"
              value={`${calculateTotalDuration()} hours`}
              readOnly
              className="w-full px-4 py-2 bg-muted border rounded-lg text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Target Skills *
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., React, TypeScript, CSS"
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {targetSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targetSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-primary/70">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Path Steps</h3>
          <Button onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="border rounded-lg">
            <div
              className="p-4 bg-muted/50 cursor-pointer flex items-center justify-between"
              onClick={() =>
                setExpandedStep(expandedStep === step.id ? null : step.id)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                  <p className="font-medium text-foreground">
                    {step.title || 'Untitled Step'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {stepTypes.find((t) => t.value === step.type)?.label}
                </span>
                {expandedStep === step.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            {expandedStep === step.id && (
              <div className="p-4 space-y-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        updateStep(step.id, { title: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Learn React Basics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Step Type
                    </label>
                    <select
                      value={step.type}
                      onChange={(e) =>
                        updateStep(step.id, {
                          type: e.target.value as PathStep['type'],
                        })
                      }
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {stepTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateStep(step.id, { description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="What will learners do in this step?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={step.estimatedHours}
                      onChange={(e) =>
                        updateStep(step.id, {
                          estimatedHours: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id={`optional-${step.id}`}
                      checked={step.isOptional}
                      onChange={(e) =>
                        updateStep(step.id, { isOptional: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`optional-${step.id}`}
                      className="text-sm text-foreground"
                    >
                      Optional step
                    </label>
                  </div>
                </div>

                {/* Step Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => moveStep(step.id, 'up')}
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                    >
                      Move Up
                    </Button>
                    <Button
                      onClick={() => moveStep(step.id, 'down')}
                      variant="outline"
                      size="sm"
                      disabled={index === steps.length - 1}
                    >
                      Move Down
                    </Button>
                  </div>

                  <Button
                    onClick={() => deleteStep(step.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Step
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {steps.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground">
              No steps yet. Click "Add Step" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
