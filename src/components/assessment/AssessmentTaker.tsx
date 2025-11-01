import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssessmentStore } from '@/store/assessmentStore';
import type { Assessment, AssessmentQuestion, TakeAssessmentState } from '@/types/phase3-assessment';

interface AssessmentTakerProps {
  assessmentId: string;
  onComplete?: (attemptId: string) => void;
  onExit?: () => void;
}

export default function AssessmentTaker({ assessmentId, onComplete, onExit }: AssessmentTakerProps) {
  const {
    currentAssessment,
    questions,
    currentAttempt,
    startAttempt,
    submitAttempt,
    saveResponse,
    fetchAssessment,
    fetchQuestions,
    isLoading,
  } = useAssessmentStore();

  const [state, setState] = useState<TakeAssessmentState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: undefined,
    isSubmitting: false,
  });

  const [showWarning, setShowWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load assessment and questions
  useEffect(() => {
    const loadData = async () => {
      await fetchAssessment(assessmentId);
      await fetchQuestions(assessmentId);
    };
    loadData();
  }, [assessmentId]);

  // Set up timer
  useEffect(() => {
    if (currentAssessment?.time_limit_minutes && !state.timeRemaining) {
      setState((prev) => ({
        ...prev,
        timeRemaining: currentAssessment.time_limit_minutes * 60,
      }));
    }
  }, [currentAssessment]);

  // Timer countdown
  useEffect(() => {
    if (!state.timeRemaining || state.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setState((prev) => {
        const newTime = prev.timeRemaining! - 1;
        if (newTime <= 0) {
          // Auto-submit when time runs out
          handleSubmit();
          return prev;
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining]);

  // Auto-save responses
  useEffect(() => {
    if (!currentAttempt || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(async () => {
      const currentQuestion = questions[state.currentQuestionIndex];
      if (currentQuestion) {
        await saveResponse(
          currentAttempt.id,
          currentQuestion.id,
          state.answers[currentQuestion.id]
        );
        setHasUnsavedChanges(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [state.answers, state.currentQuestionIndex, currentAttempt, hasUnsavedChanges]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewAttempt = async () => {
    const attempt = await startAttempt(assessmentId);
    if (!attempt) {
      console.error('Failed to start attempt');
    }
  };

  // Initialize attempt on first load
  useEffect(() => {
    if (!currentAttempt && questions.length > 0) {
      startNewAttempt();
    }
  }, [questions]);

  const updateAnswer = (questionId: string, answer: any) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!currentAttempt) return;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    const responses = Object.entries(state.answers).map(([questionId, answer]) => ({
      question_id: questionId,
      answer_text: answer.answer_text,
      answer_data: answer.answer_data,
    }));

    const success = await submitAttempt(currentAttempt.id, { responses });

    if (success && onComplete) {
      onComplete(currentAttempt.id);
    }

    setState((prev) => ({ ...prev, isSubmitting: false }));
  };

  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowWarning(true);
      return;
    }
    if (onExit) onExit();
  };

  const getAnsweredCount = () => {
    return Object.keys(state.answers).filter((qId) => state.answers[qId]).length;
  };

  if (isLoading || !currentAssessment || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{currentAssessment.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {state.currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          {state.timeRemaining && (
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className={`font-mono text-lg ${state.timeRemaining < 300 ? 'text-destructive' : ''}`}>
                {formatTime(state.timeRemaining)}
              </span>
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Answered: {getAnsweredCount()} / {questions.length}</span>
          <span>Total Points: {currentAssessment.total_points}</span>
        </div>
      </div>

      {showWarning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Are you sure you want to exit? Your progress may be lost.
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive" onClick={onExit}>
                Exit Anyway
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowWarning(false)}>
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">
                Question {state.currentQuestionIndex + 1}
                <Badge variant="outline" className="ml-2">
                  {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                </Badge>
              </CardTitle>
              <p className="text-foreground">{currentQuestion.question_text}</p>
            </div>
            {state.answers[currentQuestion.id] && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <QuestionRenderer
            question={currentQuestion}
            answer={state.answers[currentQuestion.id]}
            onChange={(answer) => updateAnswer(currentQuestion.id, answer)}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => goToQuestion(state.currentQuestionIndex - 1)}
          disabled={state.currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {/* Question navigator */}
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === state.currentQuestionIndex ? 'default' : 'outline'}
                size="sm"
                className="w-10 h-10"
                onClick={() => goToQuestion(index)}
              >
                {state.answers[questions[index].id] ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </Button>
            ))}
          </div>
        </div>

        {state.currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={() => goToQuestion(state.currentQuestionIndex + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
          >
            {state.isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        )}
      </div>

      {/* Instructions */}
      {currentAssessment.instructions && state.currentQuestionIndex === 0 && (
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-sm">{currentAssessment.instructions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Question Renderer Component
interface QuestionRendererProps {
  question: AssessmentQuestion;
  answer: any;
  onChange: (answer: any) => void;
}

function QuestionRenderer({ question, answer, onChange }: QuestionRendererProps) {
  switch (question.question_type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
    case 'true_false':
      return (
        <TrueFalseQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
    case 'short_answer':
      return (
        <ShortAnswerQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
    case 'essay':
      return (
        <EssayQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
    case 'code':
      return (
        <CodeQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
    default:
      return <div>Unsupported question type</div>;
  }
}

function MultipleChoiceQuestion({ question, answer, onChange }: QuestionRendererProps) {
  const selectedOptionId = answer?.answer_data?.option_id;

  return (
    <div className="space-y-3">
      {question.question_data.options?.map((option: any) => (
        <label
          key={option.id}
          className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
        >
          <input
            type="radio"
            name="multiple_choice"
            checked={selectedOptionId === option.id}
            onChange={() =>
              onChange({
                answer_text: option.text,
                answer_data: { option_id: option.id },
              })
            }
            className="h-4 w-4"
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
}

function TrueFalseQuestion({ question, answer, onChange }: QuestionRendererProps) {
  const selectedValue = answer?.answer_data?.value;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
        <input
          type="radio"
          name="true_false"
          checked={selectedValue === true}
          onChange={() =>
            onChange({
              answer_text: 'True',
              answer_data: { value: true },
            })
          }
          className="h-4 w-4"
        />
        <span>True</span>
      </label>
      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
        <input
          type="radio"
          name="true_false"
          checked={selectedValue === false}
          onChange={() =>
            onChange({
              answer_text: 'False',
              answer_data: { value: false },
            })
          }
          className="h-4 w-4"
        />
        <span>False</span>
      </label>
    </div>
  );
}

function ShortAnswerQuestion({ question, answer, onChange }: QuestionRendererProps) {
  return (
    <textarea
      className="w-full p-3 border rounded-lg min-h-[100px]"
      value={answer?.answer_text || ''}
      onChange={(e) =>
        onChange({
          answer_text: e.target.value,
        })
      }
      placeholder="Type your answer here..."
    />
  );
}

function EssayQuestion({ question, answer, onChange }: QuestionRendererProps) {
  const wordCount = answer?.answer_text?.split(/\s+/).filter(Boolean).length || 0;
  const maxWords = question.question_data.max_words || 500;

  return (
    <div className="space-y-2">
      <textarea
        className="w-full p-3 border rounded-lg min-h-[200px] font-mono"
        value={answer?.answer_text || ''}
        onChange={(e) =>
          onChange({
            answer_text: e.target.value,
          })
        }
        placeholder="Write your essay here..."
      />
      <div className="text-sm text-muted-foreground text-right">
        {wordCount} / {maxWords} words
      </div>
    </div>
  );
}

function CodeQuestion({ question, answer, onChange }: QuestionRendererProps) {
  return (
    <div className="space-y-2">
      {question.question_data.starter_code && (
        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
          <code>{question.question_data.starter_code}</code>
        </pre>
      )}
      <textarea
        className="w-full p-3 border rounded-lg min-h-[200px] font-mono text-sm"
        value={answer?.answer_text || ''}
        onChange={(e) =>
          onChange({
            answer_text: e.target.value,
            answer_data: { language: question.question_data.language },
          })
        }
        placeholder="Write your code here..."
      />
    </div>
  );
}

// Import Badge component
import { Badge } from '@/components/ui/badge';
