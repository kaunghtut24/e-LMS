import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SkillQuestion {
  id: string;
  skillName: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface SkillAssessmentProps {
  questions: SkillQuestion[];
  onComplete: (results: { correct: number; total: number; skillResults: Record<string, number> }) => void;
  skillNames: string[];
}

const mockQuestions: SkillQuestion[] = [
  {
    id: '1',
    skillName: 'React',
    question: 'What hook is used to manage state in React functional components?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 0,
  },
  {
    id: '2',
    skillName: 'React',
    question: 'Which method is used to render a React element to the DOM?',
    options: ['React.render()', 'ReactDOM.render()', 'render()', 'DOM.render()'],
    correctAnswer: 1,
  },
  {
    id: '3',
    skillName: 'TypeScript',
    question: 'What keyword is used to define a custom type in TypeScript?',
    options: ['type', 'interface', 'class', 'typeOf'],
    correctAnswer: 0,
  },
  {
    id: '4',
    skillName: 'TypeScript',
    question: 'Which of the following is NOT a primitive type in TypeScript?',
    options: ['string', 'number', 'boolean', 'Array'],
    correctAnswer: 3,
  },
];

export default function SkillAssessment({
  questions,
  onComplete,
  skillNames,
}: SkillAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const results = calculateResults();
    setShowResults(true);
    setTimeout(() => {
      onComplete(results);
    }, 3000); // Show results for 3 seconds
  };

  const calculateResults = () => {
    let correct = 0;
    const skillResults: Record<string, number> = {};

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correct++;
      }

      if (!skillResults[question.skillName]) {
        skillResults[question.skillName] = 0;
      }
      if (isCorrect) {
        skillResults[question.skillName]++;
      }
    });

    return { correct, total: questions.length, skillResults };
  };

  const getSkillLevel = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return 'Expert';
    if (percentage >= 60) return 'Advanced';
    if (percentage >= 40) return 'Intermediate';
    if (percentage >= 20) return 'Beginner';
    return 'None';
  };

  if (showResults) {
    const results = calculateResults();
    const skillLevels = Object.entries(results.skillResults).map(([skill, correct]) => ({
      skill,
      level: getSkillLevel(correct, questions.filter((q) => q.skillName === skill).length),
    }));

    return (
      <div className="bg-card border rounded-lg p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Assessment Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You've completed the skill assessment. Here are your results:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-3xl font-bold text-primary">
              {Math.round((results.correct / results.total) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {results.correct} out of {results.total} correct
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillLevels.map((skill) => (
              <div key={skill.skill} className="p-3 border rounded-lg">
                <p className="font-semibold text-foreground">{skill.skill}</p>
                <p className="text-sm text-primary">{skill.level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      {/* Progress */}
      <div className="mb-6">
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
            {currentQuestion.skillName}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
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
                    {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
