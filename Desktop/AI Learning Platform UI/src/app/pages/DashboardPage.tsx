import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Plus,
  Sparkles,
  Play,
  Bookmark,
  Code,
  Atom,
  Brain,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const popularCompanions = [
    {
      id: 1,
      name: 'Java Fundamentals',
      topic: 'Object-Oriented Programming',
      subject: 'Coding',
      duration: '45 mins',
      color: 'purple',
      icon: Code
    },
    {
      id: 2,
      name: 'Physics Mastery',
      topic: 'Newton\'s Law of Motion',
      subject: 'Science',
      duration: '30 mins',
      color: 'pink',
      icon: Atom
    },
    {
      id: 3,
      name: 'Data Structures',
      topic: 'Arrays and Linked Lists',
      subject: 'Coding',
      duration: '50 mins',
      color: 'blue',
      icon: Brain
    }
  ];

  const recentSessions = [
    {
      id: 1,
      lesson: 'Object-Oriented Programming',
      subtitle: 'Java Fundamentals',
      subject: 'Coding',
      duration: '25 min',
      icon: Code
    },
    {
      id: 2,
      lesson: 'Newton\'s Laws of Motion',
      subtitle: 'Physics Mastery',
      subject: 'Science',
      duration: '30 min',
      icon: Atom
    },
    {
      id: 3,
      lesson: 'Arrays and Pointers',
      subtitle: 'Data Structures',
      subject: 'Coding',
      duration: '20 min',
      icon: Brain
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Session Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Atom className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Technical Skills</h3>
                      <p className="text-gray-600 mb-2">Newton's Law of Motion</p>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                        Science
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">5 minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Companions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Popular Companions</h2>
                  <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {popularCompanions.map((companion) => (
                    <div
                      key={companion.id}
                      className={`bg-gradient-to-br ${
                        companion.color === 'purple' ? 'from-purple-50 to-purple-100/50' :
                        companion.color === 'pink' ? 'from-pink-50 to-pink-100/50' :
                        'from-blue-50 to-blue-100/50'
                      } rounded-2xl p-6 border ${
                        companion.color === 'purple' ? 'border-purple-100' :
                        companion.color === 'pink' ? 'border-pink-100' :
                        'border-blue-100'
                      } hover:shadow-lg transition-all cursor-pointer group`}
                      onClick={() => navigate(`/learn/${companion.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 ${
                              companion.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                              companion.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                              'bg-blue-100 text-blue-700'
                            } rounded-lg text-sm font-medium`}>
                              {companion.subject}
                            </span>
                            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{companion.name}</h3>
                          <p className="text-gray-600 mb-3">{companion.topic}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{companion.duration}</span>
                          </div>
                        </div>
                        <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group-hover:scale-105">
                          <Play className="w-4 h-4" />
                          Launch Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Completed Sessions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Completed Sessions</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {recentSessions.map((session, index) => (
                    <div
                      key={session.id}
                      className={`p-5 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer ${
                        index !== recentSessions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <session.icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{session.lesson}</h3>
                          <p className="text-sm text-gray-500">{session.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                          {session.subject}
                        </span>
                        <span className="text-gray-600 text-sm">{session.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - 1/3 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Build Companion Promo Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/20 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-8 h-8 text-orange-400" />
                      <BookOpen className="w-8 h-8 text-purple-400" />
                      <Brain className="w-8 h-8 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      Build and Personalize Learning Companion
                    </h3>
                    <p className="text-gray-300 text-sm mb-6">
                      Create a custom AI companion tailored to your learning style and goals. Start your personalized learning journey today.
                    </p>
                    <button 
                      onClick={() => navigate('/build-companion')}
                      className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      Build a New Companion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
