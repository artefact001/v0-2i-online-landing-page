'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { quizService } from '@/lib/quiz-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await quizService.getQuizWithQuestions(quizId);
        setQuiz(quizData);
        setTimeLeft(quizData.duration_minutes * 60);
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.quiz_questions?.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await quizService.gradeQuizAttempt(quizId, answers);
      setScore(result.score);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!quiz) {
    return <div className="flex items-center justify-center min-h-screen">Quiz non trouvé</div>;
  }

  const question = quiz.quiz_questions?.[currentQuestion];
  const progress = ((currentQuestion + 1) / (quiz.quiz_questions?.length || 1)) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const passed = score >= quiz.pass_score;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D2545] to-[#1a3a5c] p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white">
          <div className="p-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#0D2545]">
              {passed ? 'Félicitations!' : 'Essayez à nouveau'}
            </h1>
            <div className="text-6xl font-bold text-[#C9A227] my-6">{score}%</div>
            <p className="text-xl text-gray-600 mb-4">
              Score: {score} / 100 (Seuil: {quiz.pass_score}%)
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-[#0D2545] hover:bg-[#0a1d2e]"
            >
              Retour au cours
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D2545] to-[#1a3a5c] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
          <div className="text-white text-2xl font-bold">
            {timeLeft !== null && formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg overflow-hidden">
          <div
            className="h-2 bg-[#C9A227] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="bg-white p-8 mb-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} de {quiz.quiz_questions?.length}
            </p>
            <h2 className="text-2xl font-bold text-[#0D2545] mb-4">{question?.question_text}</h2>
          </div>

          <div className="space-y-3">
            {question?.question_type === 'multiple_choice' && (
              <div className="space-y-3">
                {question.options?.map((option: string, idx: number) => (
                  <label key={idx} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question?.question_type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {['Vrai', 'Faux'].map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question?.question_type === 'short_answer' && (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Votre réponse..."
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                rows={4}
              />
            )}
          </div>
        </Card>

        <div className="flex justify-between gap-4">
          <Button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Précédent
          </Button>

          {currentQuestion === (quiz.quiz_questions?.length || 0) - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545]"
            >
              Soumettre
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-[#0D2545] hover:bg-[#0a1d2e]"
            >
              Suivant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
