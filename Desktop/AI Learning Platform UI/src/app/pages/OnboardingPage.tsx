import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Beaker, Calculator, Lightbulb, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    topic: '',
    level: '',
    language: ''
  });

  const topics = [
    { id: 'coding', label: 'Coding', icon: Code, color: 'violet' },
    { id: 'science', label: 'Science', icon: Beaker, color: 'pink' },
    { id: 'maths', label: 'Maths', icon: Calculator, color: 'violet' },
    { id: 'custom', label: 'Custom Topic', icon: Lightbulb, color: 'pink' }
  ];

  const levels = [
    { id: 'beginner-advanced', label: 'Beginner → Advanced', desc: 'Start from basics' },
    { id: 'advanced-only', label: 'Only Advanced', desc: 'Skip the basics' },
    { id: 'flexible', label: "I'll decide while learning", desc: 'Choose as you go' }
  ];

  const languages = [
    { id: 'hindi', label: 'Hindi', flag: '🇮🇳' },
    { id: 'english', label: 'English', flag: '🇬🇧' },
    { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳' }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) return selections.topic !== '';
    if (step === 2) return selections.level !== '';
    if (step === 3) return selections.language !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-16 bg-gradient-to-r from-violet-500 to-pink-500' : 
                  s < step ? 'w-8 bg-violet-300' : 'w-8 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 text-gray-800">What do you want to learn?</h2>
                <p className="text-gray-600">Choose a topic to get started</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {topics.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selections.topic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelections({ ...selections, topic: topic.id })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected
                          ? `border-${topic.color}-500 bg-gradient-to-br from-${topic.color}-50 to-pink-50 shadow-lg shadow-${topic.color}-100`
                          : 'border-gray-200 hover:border-violet-200 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? `bg-gradient-to-br from-${topic.color}-500 to-pink-500` : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800">{topic.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 text-gray-800">How do you want to learn?</h2>
                <p className="text-gray-600">Choose your learning path</p>
              </div>
              
              <div className="space-y-4">
                {levels.map((level) => {
                  const isSelected = selections.level === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelections({ ...selections, level: level.id })}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-pink-50 shadow-lg shadow-violet-100'
                          : 'border-gray-200 hover:border-violet-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-gradient-to-br from-violet-500 to-pink-500' : 'bg-gray-100'
                        }`}>
                          {isSelected ? <Check className="w-5 h-5 text-white" /> : <div className="w-3 h-3 rounded-full bg-gray-300" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{level.label}</h3>
                          <p className="text-sm text-gray-600">{level.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 text-gray-800">Choose Your Language</h2>
                <p className="text-gray-600">How would you like to learn?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {languages.map((lang) => {
                  const isSelected = selections.language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => setSelections({ ...selections, language: lang.id })}
                      className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-pink-50 shadow-lg shadow-violet-100'
                          : 'border-gray-200 hover:border-violet-200 hover:shadow-md'
                      }`}
                    >
                      <div className="text-4xl mb-3">{lang.flag}</div>
                      <h3 className="font-semibold text-gray-800">{lang.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                step === 1 
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                canProceed()
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Take me to Dashboard' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
