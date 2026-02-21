import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function MCQCheckpointPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: 'What is the main principle of Object-Oriented Programming?',
      options: [
        'Sequential execution of code',
        'Encapsulation, Inheritance, and Polymorphism',
        'Using only functions',
        'Avoiding classes'
      ],
      correct: 1,
      explanation: 'OOP is based on four main principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.'
    },
    {
      question: 'Which keyword is used to inherit a class in Java?',
      options: ['implements', 'inherits', 'extends', 'derives'],
      correct: 2,
      explanation: 'The "extends" keyword is used in Java to inherit from a parent class.'
    }
  ];

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correct;

  const handleAnswer = () => {
    setShowFeedback(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate(`/learn/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              FlashBox
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-violet-600">
              Score: {score}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQ.correct;
              const showCorrect = showFeedback && isCorrectOption;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && setSelectedAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    showCorrect
                      ? 'bg-green-500'
                      : showWrong
                      ? 'bg-red-500'
                      : isSelected
                      ? 'bg-violet-500'
                      : 'bg-gray-200'
                  }`}>
                    {showCorrect ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : showWrong ? (
                      <XCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  <span className={`flex-1 font-medium ${
                    showCorrect || showWrong ? 'text-gray-800' : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-5 rounded-xl ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct! Well done! 🎉' : 'Not quite right'}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!showFeedback ? (
            <button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className={`flex-1 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Continue Learning'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
