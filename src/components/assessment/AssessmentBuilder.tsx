import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, Eye, Settings, X, Check, Clock, HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAssessmentStore } from '@/store/assessmentStore';
import type { AssessmentType, QuestionType, DifficultyLevel, AssessmentFormData, QuestionFormData } from '@/types/phase3-assessment';

interface AssessmentBuilderProps {
  courseId: string;
  assessmentId?: string;
  onSave?: (assessmentId: string) => void;
  onCancel?: () => void;
}

export default function AssessmentBuilder({ courseId, assessmentId, onSave, onCancel }: AssessmentBuilderProps) {
  const {
    currentAssessment,
    questions,
    fetchAssessment,
    fetchQuestions,
    createAssessment,
    updateAssessment,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    publishAssessment,
    isLoading,
    error,
    clearError,
  } = useAssessmentStore();

  const [activeTab, setActiveTab] = useState('details');
  const [isPublished, setIsPublished] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    description: '',
    type: 'quiz',
    instructions: '',
    time_limit_minutes: undefined,
    max_attempts: 1,
    passing_score: undefined,
    shuffle_questions: false,
    show_correct_answers: true,
    available_from: undefined,
    available_until: undefined,
    randomize_answers: false,
    weight: 100,
    questions: [],
  });

  // Question editing state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('multiple_choice');
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  // Load assessment if editing
  useEffect(() => {
    if (assessmentId) {
      fetchAssessment(assessmentId).then(() => {
        fetchQuestions(assessmentId);
      });
    }
    clearError();
  }, [assessmentId]);

  // Update form when assessment loads
  useEffect(() => {
    if (currentAssessment) {
      setFormData({
        title: currentAssessment.title,
        description: currentAssessment.description || '',
        type: currentAssessment.type,
        instructions: currentAssessment.instructions || '',
        time_limit_minutes: currentAssessment.time_limit_minutes || undefined,
        max_attempts: currentAssessment.max_attempts,
        passing_score: currentAssessment.passing_score || undefined,
        shuffle_questions: currentAssessment.shuffle_questions,
        show_correct_answers: currentAssessment.show_correct_answers,
        available_from: currentAssessment.available_from || undefined,
        available_until: currentAssessment.available_until || undefined,
        randomize_answers: currentAssessment.randomize_answers,
        weight: currentAssessment.weight,
        questions: [],
      });
      setIsPublished(currentAssessment.is_published);
    }
  }, [currentAssessment]);

  // Update questions list when questions load
  useEffect(() => {
    if (questions.length > 0 && formData.questions.length === 0) {
      setFormData((prev) => ({
        ...prev,
        questions: questions.map((q) => ({
          question_type: q.question_type,
          question_text: q.question_text,
          points: q.points,
          explanation: q.explanation || '',
          tags: q.tags || [],
          difficulty: q.difficulty,
          question_data: q.question_data,
        })),
      }));
    }
  }, [questions]);

  const handleSave = async () => {
    clearError();

    try {
      let savedAssessment;

      if (assessmentId) {
        // Update existing
        const success = await updateAssessment(assessmentId, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          instructions: formData.instructions,
          time_limit_minutes: formData.time_limit_minutes,
          max_attempts: formData.max_attempts,
          passing_score: formData.passing_score,
          shuffle_questions: formData.shuffle_questions,
          show_correct_answers: formData.show_correct_answers,
          available_from: formData.available_from,
          available_until: formData.available_until,
          randomize_answers: formData.randomize_answers,
          weight: formData.weight,
        });

        if (!success) throw new Error('Failed to update assessment');

        savedAssessment = currentAssessment;
      } else {
        // Create new
        savedAssessment = await createAssessment({
          course_id: courseId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          instructions: formData.instructions,
          time_limit_minutes: formData.time_limit_minutes,
          max_attempts: formData.max_attempts,
          passing_score: formData.passing_score,
          shuffle_questions: formData.shuffle_questions,
          show_correct_answers: formData.show_correct_answers,
          available_from: formData.available_from,
          available_until: formData.available_until,
          randomize_answers: formData.randomize_answers,
          weight: formData.weight,
        });

        if (!savedAssessment) throw new Error('Failed to create assessment');

        // Sync questions
        await syncQuestions(savedAssessment.id);
      }

      if (onSave && savedAssessment) {
        onSave(savedAssessment.id);
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
  };

  const syncQuestions = async (assessmentId: string) => {
    // Get existing questions
    const { data: existingQuestions } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId);

    const existingIds = new Set(existingQuestions?.map((q) => q.id));

    // Create/update questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      await createQuestion({
        assessment_id: assessmentId,
        question_type: q.question_type,
        question_text: q.question_text,
        question_data: q.question_data,
        points: q.points,
        explanation: q.explanation,
        tags: q.tags,
        difficulty: q.difficulty,
      });
    }
  };

  const handlePublish = async () => {
    if (!assessmentId) {
      await handleSave();
    }

    if (assessmentId) {
      const success = await publishAssessment(assessmentId);
      if (success) {
        setIsPublished(true);
      }
    }
  };

  const handleAddQuestion = async () => {
    if (!assessmentId && !currentAssessment) {
      // Save assessment first
      await handleSave();
      return;
    }

    setIsCreatingQuestion(true);
    const newQuestion: QuestionFormData = {
      question_type: newQuestionType,
      question_text: 'New Question',
      points: 1,
      explanation: '',
      tags: [],
      difficulty: 'medium',
      question_data: getDefaultQuestionData(newQuestionType),
    };

    const questionId = `temp-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setEditingQuestionId(questionId);
    setIsCreatingQuestion(false);
  };

  const getDefaultQuestionData = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return {
          options: [
            { id: '1', text: 'Option 1', is_correct: true },
            { id: '2', text: 'Option 2', is_correct: false },
          ],
        };
      case 'true_false':
        return { correct_answer: true };
      case 'short_answer':
        return {};
      case 'essay':
        return { max_words: 500 };
      case 'fill_blank':
        return { blanks: [] };
      case 'matching':
        return { pairs: [] };
      case 'code':
        return { language: 'javascript', starter_code: '' };
      default:
        return {};
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    const question = questions[index];
    if (question && question.id) {
      await deleteQuestion(question.id);
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestionAtIndex = (index: number, question: QuestionFormData) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? question : q)),
    }));
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return '🔘';
      case 'true_false':
        return '✓';
      case 'short_answer':
        return '✏️';
      case 'essay':
        return '📝';
      case 'fill_blank':
        return '___';
      case 'matching':
        return '🔗';
      case 'code':
        return '{ }';
      default:
        return '❓';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {assessmentId ? 'Edit Assessment' : 'Create Assessment'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Build and configure your assessment
          </p>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="default" onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={isLoading || isPublished}
          >
            {isPublished ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Published
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({formData.questions.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., JavaScript Fundamentals Quiz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: AssessmentType) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this assessment covers..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  placeholder="Provide instructions for students taking this assessment..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assessment Questions</CardTitle>
                  <CardDescription>
                    Add and configure questions for your assessment
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={newQuestionType}
                    onValueChange={(value: QuestionType) =>
                      setNewQuestionType(value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {formData.questions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No questions yet. Add your first question to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <QuestionCard
                      key={index}
                      index={index}
                      question={question}
                      onUpdate={(q) => updateQuestionAtIndex(index, q)}
                      onDelete={() => handleDeleteQuestion(index)}
                      isEditing={editingQuestionId === `temp-${index}`}
                      onToggleEdit={() =>
                        setEditingQuestionId(
                          editingQuestionId === `temp-${index}` ? null : `temp-${index}`
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timing & Attempts</CardTitle>
              <CardDescription>
                Configure time limits and attempt policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={formData.time_limit_minutes || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        time_limit_minutes: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g., 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_attempts">Max Attempts</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    value={formData.max_attempts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_attempts: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passing_score">Passing Score (%)</Label>
                <Input
                  id="passing_score"
                  type="number"
                  value={formData.passing_score || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passing_score: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 70"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Settings</CardTitle>
              <CardDescription>
                Configure how questions are displayed and graded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shuffle Questions</Label>
                  <p className="text-sm text-muted-foreground">
                    Randomize question order
                  </p>
                </div>
                <Switch
                  checked={formData.shuffle_questions}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, shuffle_questions: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Randomize Answers</Label>
                  <p className="text-sm text-muted-foreground">
                    Randomize answer options for multiple choice
                  </p>
                </div>
                <Switch
                  checked={formData.randomize_answers}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, randomize_answers: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Correct Answers</Label>
                  <p className="text-sm text-muted-foreground">
                    Display correct answers after submission
                  </p>
                </div>
                <Switch
                  checked={formData.show_correct_answers}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, show_correct_answers: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                Set when students can take this assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available_from">Available From</Label>
                  <Input
                    id="available_from"
                    type="datetime-local"
                    value={formData.available_from || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_from: e.target.value || undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available_until">Available Until</Label>
                  <Input
                    id="available_until"
                    type="datetime-local"
                    value={formData.available_until || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_until: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Question Card Component
interface QuestionCardProps {
  index: number;
  question: QuestionFormData;
  onUpdate: (question: QuestionFormData) => void;
  onDelete: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

function QuestionCard({
  index,
  question,
  onUpdate,
  onDelete,
  isEditing,
  onToggleEdit,
}: QuestionCardProps) {
  const [localQuestion, setLocalQuestion] = useState(question);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const handleSave = () => {
    onUpdate(localQuestion);
    onToggleEdit();
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <Badge variant="secondary">
            {getQuestionTypeIcon(question.question_type)} Q{index + 1}
          </Badge>
          <Badge variant="outline">{question.points} pts</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onToggleEdit}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={localQuestion.question_type}
              onValueChange={(value: QuestionType) =>
                setLocalQuestion({
                  ...localQuestion,
                  question_type: value,
                  question_data: getDefaultQuestionData(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                <SelectItem value="matching">Matching</SelectItem>
                <SelectItem value="code">Code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={localQuestion.question_text}
              onChange={(e) =>
                setLocalQuestion({ ...localQuestion, question_text: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Points</Label>
              <Input
                type="number"
                value={localQuestion.points}
                onChange={(e) =>
                  setLocalQuestion({
                    ...localQuestion,
                    points: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={localQuestion.difficulty}
                onValueChange={(value: DifficultyLevel) =>
                  setLocalQuestion({ ...localQuestion, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={localQuestion.tags?.join(', ') || ''}
                onChange={(e) =>
                  setLocalQuestion({
                    ...localQuestion,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g., javascript, basics"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Explanation (optional)</Label>
            <Textarea
              value={localQuestion.explanation}
              onChange={(e) =>
                setLocalQuestion({ ...localQuestion, explanation: e.target.value })
              }
              rows={2}
              placeholder="Explain the correct answer..."
            />
          </div>

          <QuestionTypeEditor
            type={localQuestion.question_type}
            data={localQuestion.question_data}
            onChange={(data) =>
              setLocalQuestion({ ...localQuestion, question_data: data })
            }
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onToggleEdit}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Question</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-medium">{question.question_text}</p>
          {question.explanation && (
            <p className="text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4 inline mr-1" />
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Question Type Editor Component
interface QuestionTypeEditorProps {
  type: QuestionType;
  data: any;
  onChange: (data: any) => void;
}

function QuestionTypeEditor({ type, data, onChange }: QuestionTypeEditorProps) {
  switch (type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceEditor data={data} onChange={onChange} />
      );
    case 'true_false':
      return (
        <TrueFalseEditor data={data} onChange={onChange} />
      );
    case 'short_answer':
      return <ShortAnswerEditor data={data} onChange={onChange} />;
    case 'essay':
      return <EssayEditor data={data} onChange={onChange} />;
    case 'code':
      return <CodeEditor data={data} onChange={onChange} />;
    default:
      return null;
  }
}

function MultipleChoiceEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const addOption = () => {
    const options = [...(data.options || [])];
    options.push({
      id: String(options.length + 1),
      text: 'New option',
      is_correct: false,
    });
    onChange({ ...data, options });
  };

  const updateOption = (id: string, field: string, value: any) => {
    const options = data.options.map((opt: any) =>
      opt.id === id ? { ...opt, [field]: value } : opt
    );
    onChange({ ...data, options });
  };

  const deleteOption = (id: string) => {
    const options = data.options.filter((opt: any) => opt.id !== id);
    onChange({ ...data, options });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button size="sm" onClick={addOption}>
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>
      {data.options?.map((option: any) => (
        <div key={option.id} className="flex items-center gap-2">
          <input
            type="radio"
            name="correct"
            checked={option.is_correct}
            onChange={() => {
              const options = data.options.map((opt: any) => ({
                ...opt,
                is_correct: opt.id === option.id,
              }));
              onChange({ ...data, options });
            }}
          />
          <Input
            value={option.text}
            onChange={(e) => updateOption(option.id, 'text', e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteOption(option.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function TrueFalseEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <Label>Correct Answer</Label>
      <Select
        value={String(data.correct_answer)}
        onValueChange={(value) => onChange({ ...data, correct_answer: value === 'true' })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ShortAnswerEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <Label>Sample Answer (optional)</Label>
      <Input
        value={data.sample_answer || ''}
        onChange={(e) => onChange({ ...data, sample_answer: e.target.value })}
        placeholder="Expected answer..."
      />
    </div>
  );
}

function EssayEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <Label>Word Limit</Label>
      <Input
        type="number"
        value={data.max_words || 500}
        onChange={(e) => onChange({ ...data, max_words: parseInt(e.target.value) })}
      />
    </div>
  );
}

function CodeEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Programming Language</Label>
        <Select
          value={data.language || 'javascript'}
          onValueChange={(value) => onChange({ ...data, language: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Starter Code (optional)</Label>
        <Textarea
          value={data.starter_code || ''}
          onChange={(e) => onChange({ ...data, starter_code: e.target.value })}
          rows={6}
          placeholder="// Write your code here"
        />
      </div>
    </div>
  );
}

function getDefaultQuestionData(type: QuestionType) {
  switch (type) {
    case 'multiple_choice':
      return {
        options: [
          { id: '1', text: 'Option 1', is_correct: true },
          { id: '2', text: 'Option 2', is_correct: false },
        ],
      };
    case 'true_false':
      return { correct_answer: true };
    default:
      return {};
  }
}

function getQuestionTypeIcon(type: QuestionType) {
  switch (type) {
    case 'multiple_choice':
      return '🔘';
    case 'true_false':
      return '✓';
    case 'short_answer':
      return '✏️';
    case 'essay':
      return '📝';
    case 'fill_blank':
      return '___';
    case 'matching':
      return '🔗';
    case 'code':
      return '{ }';
    default:
      return '❓';
  }
}
