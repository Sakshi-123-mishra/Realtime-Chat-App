import { useNavigate } from 'react-router-dom';
import { Brain, Flame, Target, TrendingUp, Award, Calendar, Clock } from 'lucide-react';

export default function MyJourneyPage() {
  const navigate = useNavigate();

  const weakTopics = ['Polymorphism', 'Inheritance', 'Abstract Classes'];
  const achievements = [
    { title: '7 Day Streak', icon: Flame, color: 'orange' },
    { title: '10 Topics Mastered', icon: Award, color: 'violet' },
    { title: '85% Accuracy', icon: Target, color: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
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
              <button className="text-violet-600 font-medium">
                My Journey
              </button>
              <button onClick={() => navigate('/account')} className="text-gray-600 hover:text-violet-600 transition-colors">
                Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Learning Journey</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-800">7 days 🔥</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Keep it up! You're on a roll!</p>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6 border-2 border-violet-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Accuracy</p>
                <p className="text-3xl font-bold text-gray-800">85%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Great progress this week!</p>
          </div>

          {/* Time */}
          <div className="bg-gradient-to-br from-pink-50 to-violet-50 rounded-2xl p-6 border-2 border-pink-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time This Week</p>
                <p className="text-3xl font-bold text-gray-800">24h</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">8 hours more than last week</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, i) => {
              const Icon = achievement.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${achievement.color}-500 to-pink-500 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600">Unlocked</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Topics to Review</h2>
          <div className="flex flex-wrap gap-3">
            {weakTopics.map((topic, i) => (
              <div key={i} className="px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                <span className="text-red-700 font-medium">{topic}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">These topics need more practice. We'll focus on them in upcoming sessions.</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Companions</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Java Basics</h3>
                  <p className="text-sm text-gray-600">Completed 3 days ago</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
