import React, { useState } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'code';
  question: string;
  options?: string[];
  correctAnswer?: number | boolean | string;
  points: number;
  timeLimit?: number; // in seconds
  skillTag: string;
}

interface PreAssessmentBuilderProps {
  onSave: (assessment: any) => void;
  initialData?: {
    title: string;
    description: string;
    skillTags: string[];
    questions: Question[];
  };
}

export default function PreAssessmentBuilder({
  onSave,
  initialData,
}: PreAssessmentBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [skillTags, setSkillTags] = useState<string[]>(initialData?.skillTags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || []
  );
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
    { value: 'code', label: 'Code Challenge' },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      skillTag: '',
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    }
  };

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, { options: [...question.options, ''] });
    }
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, index: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== index);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const addSkillTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !skillTags.includes(tag)) {
      setSkillTags([...skillTags, tag]);
      setCurrentTag('');
    }
  };

  const removeSkillTag = (tag: string) => {
    setSkillTags(skillTags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const assessment = {
      title,
      description,
      skillTags,
      questions: questions.map(({ id, ...q }) => q),
    };

    onSave(assessment);
    toast.success('Assessment saved successfully!');
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Pre-Assessment Builder
        </h2>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Assessment
        </Button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Assessment Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., JavaScript Fundamentals Assessment"
          />
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
            placeholder="Describe what this assessment covers..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Skill Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkillTag()}
              className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., javascript, react, node.js"
            />
            <Button onClick={addSkillTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeSkillTag(tag)}
                    className="hover:text-primary/70"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Questions</h3>
          <Button onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg">
            <div
              className="p-4 bg-muted/50 cursor-pointer flex items-center justify-between"
              onClick={() =>
                setExpandedQuestion(
                  expandedQuestion === question.id ? null : question.id
                )
              }
            >
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Question {index + 1}
                </span>
                <p className="font-medium text-foreground">
                  {question.question || 'Untitled Question'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {questionTypes.find((t) => t.value === question.type)?.label}
                </span>
                {expandedQuestion === question.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            {expandedQuestion === question.id && (
              <div className="p-4 space-y-4 border-t">
                {/* Question Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Question Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        type: e.target.value as Question['type'],
                      })
                    }
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Question Text *
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, { question: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Enter your question..."
                  />
                </div>

                {/* Skill Tag */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skill Tag
                  </label>
                  <input
                    type="text"
                    value={question.skillTag}
                    onChange={(e) =>
                      updateQuestion(question.id, { skillTag: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., javascript"
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        points: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Options for Multiple Choice */}
                {question.type === 'multiple-choice' && question.options && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-foreground">
                        Options *
                      </label>
                      <Button
                        onClick={() => addOption(question.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() =>
                              updateQuestion(question.id, {
                                correctAnswer: optionIndex,
                              })
                            }
                            className="mt-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(question.id, optionIndex, e.target.value)
                            }
                            className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {question.options.length > 2 && (
                            <Button
                              onClick={() => removeOption(question.id, optionIndex)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={() => deleteQuestion(question.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Question
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground">
              No questions yet. Click "Add Question" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
