import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { XMarkIcon, CheckCircleIcon } from './icons/Icons';

interface QuizModalProps {
  questions: QuizQuestion[];
  courseTitle: string;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, courseTitle, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAnswerClick = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    setSelectedAnswer(option);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setQuizFinished(true);
    }
  };
  
  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setFeedback(null);
      setQuizFinished(false);
  }

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
    }
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) return 'bg-green-100 dark:bg-green-900 border-green-500 ring-2 ring-green-500';
    if (isSelected && !isCorrect) return 'bg-red-100 dark:bg-red-900 border-red-500 ring-2 ring-red-500';
    return 'bg-white dark:bg-gray-700 opacity-60 cursor-not-allowed';
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col relative transform transition-all">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" id="quiz-title">
            Quiz: {courseTitle}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close quiz"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {quizFinished ? (
            <div className="text-center">
                <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Your final score is:</p>
                <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 my-4">{score} / {questions.length}</p>
                 <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={handleRestart} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">
                        Try Again
                    </button>
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
                        Close
                    </button>
                </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {currentQuestion.question}
              </h3>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full text-left p-4 border rounded-lg transition-all duration-200 flex items-center ${getButtonClass(option)}`}
                  >
                    <span className="font-bold mr-4">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {!quizFinished && (
             <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                {selectedAnswer && (
                    <div className="flex justify-between items-center animate-fade-in">
                        <div>
                             {feedback === 'correct' && <p className="font-bold text-green-600 dark:text-green-400">Correct!</p>}
                             {feedback === 'incorrect' && <p className="font-bold text-red-600 dark:text-red-400">Incorrect. The correct answer is {currentQuestion.correctAnswer}.</p>}
                        </div>
                        <button 
                            onClick={handleNextQuestion}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                        </button>
                    </div>
                )}
             </footer>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
