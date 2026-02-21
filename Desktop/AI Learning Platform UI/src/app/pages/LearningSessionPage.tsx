import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Atom, Mic, MicOff, Play, User, Volume2, VolumeX } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function LearningSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isListening, setIsListening] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleSessionToggle = () => {
    setIsSessionActive(!isSessionActive);
    if (!isSessionActive) {
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Main Learning Area (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-12 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  {/* Animated Voice Indicator */}
                  <div className="relative inline-block mb-8">
                    <div className={`w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSessionActive ? 'animate-pulse' : ''
                    }`}>
                      <Atom className="w-24 h-24 text-white" />
                    </div>
                    
                    {/* Voice Wave Animation */}
                    {isSessionActive && (
                      <>
                        <div className="absolute inset-0 -m-4">
                          <div className="w-56 h-56 border-4 border-purple-300 rounded-full animate-ping opacity-30"></div>
                        </div>
                        <div className="absolute inset-0 -m-8">
                          <div className="w-64 h-64 border-4 border-purple-200 rounded-full animate-ping opacity-20 animation-delay-200"></div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Subject Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Physics Mastery</h2>
                  <p className="text-lg text-gray-600 mb-2">Newton's Law of Motion</p>
                  <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                    Science
                  </span>

                  {/* Status Indicator */}
                  {isSessionActive && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Session Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Controls (1/3) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-500">Learning Physics</p>
                  </div>
                </div>
              </div>

              {/* Microphone Toggle Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Voice Control</h3>
                <button
                  onClick={() => setIsListening(!isListening)}
                  disabled={!isSessionActive}
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-300/50'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-300/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Speaking
                    </>
                  )}
                </button>

                {/* Voice Wave Indicator */}
                {isListening && (
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <div className="w-1 h-8 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-12 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-10 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1 h-8 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>

              {/* Volume Control */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Audio</h3>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  disabled={isMuted}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Session Control - Large Button */}
              <button
                onClick={handleSessionToggle}
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  isSessionActive
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-300/50'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-300/50'
                }`}
              >
                {isSessionActive ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 bg-white rounded-sm"></span>
                    End Session
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Session
                  </span>
                )}
              </button>

              {/* Back to Dashboard */}
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-600 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
