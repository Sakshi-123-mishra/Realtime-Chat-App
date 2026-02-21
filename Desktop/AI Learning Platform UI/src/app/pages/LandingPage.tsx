import { useNavigate } from 'react-router-dom';
import { Brain, Headphones, Target, Sparkles, Play } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                FlashBox
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-violet-600 transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/build-companion')} className="text-gray-600 hover:text-violet-600 transition-colors">
                Companions
              </button>
              <button onClick={() => navigate('/journey')} className="text-gray-600 hover:text-violet-600 transition-colors">
                My Journey
              </button>
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all duration-300">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">AI-Powered Learning</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Learn Anything with Your{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Personal AI Companion
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Talk, listen, learn — in Hindi, English or Hinglish.<br />
            Your personalized learning journey starts here.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl text-lg font-medium hover:shadow-2xl hover:shadow-violet-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white text-violet-600 rounded-xl text-lg font-medium border-2 border-violet-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Voice-Based Learning</h3>
            <p className="text-gray-600 leading-relaxed">
              Listen and learn naturally with AI-generated voice companions that explain concepts clearly
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-pink-100 hover:shadow-xl hover:shadow-pink-200 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Adaptive MCQs</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart quizzes that adapt to your learning pace and focus on your weak areas
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Personalized Pace</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn at your own speed with companions tailored to your learning style
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-violet-100 mb-8">
            Join thousands of learners using AI companions
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-violet-600 rounded-xl text-lg font-medium hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Create Your Companion
          </button>
        </div>
      </div>
    </div>
  );
}
