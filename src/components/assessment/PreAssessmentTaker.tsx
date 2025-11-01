import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AssessmentTimer from './AssessmentTimer';
import type { Question } from './PreAssessmentBuilder';

interface PreAssessmentTakerProps {
  title: string;
  description: string;
  questions: Question[];
  onComplete: (results: AssessmentResults) => void;
  showTimer?: boolean;
  allowReview?: boolean;
}

export interface AssessmentResults {
  answers: Record<string, number | boolean | string>;
  score: number;
  totalPoints: number;
  timeSpent: number;
  skillScores: Record<string, { correct: number; total: number }>;
}

export default function PreAssessmentTaker({
  title,
  description,
  questions,
  onComplete,
  showTimer = true,
  allowReview = true,
}: PreAssessmentTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | boolean | string>>({});
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [startTime] = useState(Date.now());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: number | boolean | string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const results = calculateResults(answers, timeSpent);
    onComplete(results);
  };

  const calculateResults = (
    userAnswers: Record<string, number | boolean | string>,
    timeSpent: number
  ): AssessmentResults => {
    let score = 0;
    let totalPoints = 0;
    const skillScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((question) => {
      totalPoints += question.points;

      if (!skillScores[question.skillTag]) {
        skillScores[question.skillTag] = { correct: 0, total: 0 };
      }
      skillScores[question.skillTag].total++;

      const userAnswer = userAnswers[question.id];
      let isCorrect = false;

      if (question.type === 'multiple-choice') {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === 'true-false') {
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) {
        score += question.points;
        skillScores[question.skillTag].correct++;
      }
    });

    return {
      answers: userAnswers,
      score,
      totalPoints,
      timeSpent,
      skillScores,
    };
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] !== undefined;
  };

  const getUnansweredCount = () => {
    return questions.filter((q) => !isQuestionAnswered(q.id)).length;
  };

  if (showSubmitConfirm) {
    const unanswered = getUnansweredCount();
    return (
      <div className="bg-card border rounded-lg p-8 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Submit Assessment?
        </h2>
        {unanswered > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              You have {unanswered} unanswered question{unanswered !== 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              You can still submit, but unanswered questions will be marked as incorrect.
            </p>
          </div>
        )}
        <div className="space-y-3">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Submit Assessment
          </Button>
          <Button
            onClick={() => setShowSubmitConfirm(false)}
            variant="outline"
            className="w-full"
          >
            Continue Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {showTimer && <AssessmentTimer />}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              {currentQuestion.skillTag}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.type === 'multiple-choice' &&
            currentQuestion.options?.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </div>
                </button>
              );
            })}

          {currentQuestion.type === 'true-false' && (
            <>
              <button
                onClick={() => handleAnswerChange(true)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  answers[currentQuestion.id] === true
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === true
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {answers[currentQuestion.id] === true && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-foreground">True</span>
                </div>
              </button>
              <button
                onClick={() => handleAnswerChange(false)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  answers[currentQuestion.id] === false
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === false
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {answers[currentQuestion.id] === false && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-foreground">False</span>
                </div>
              </button>
            </>
          )}

          {(currentQuestion.type === 'short-answer' ||
            currentQuestion.type === 'essay' ||
            currentQuestion.type === 'code') && (
            <textarea
              value={(answers[currentQuestion.id] as string) || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={currentQuestion.type === 'essay' ? 8 : 3}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder={
                currentQuestion.type === 'code'
                  ? '// Write your code here...'
                  : 'Enter your answer...'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {questions.map((_, index) => {
            const answered = isQuestionAnswered(questions[index].id);
            return (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  answered ? 'bg-primary' : 'bg-muted'
                } ${
                  index === currentQuestionIndex ? 'ring-2 ring-primary/50' : ''
                }`}
              />
            );
          })}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={() => setShowSubmitConfirm(true)}>
            Submit Assessment
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
