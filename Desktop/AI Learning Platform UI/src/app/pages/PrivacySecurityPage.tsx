import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ArrowLeft, Monitor, Smartphone, MapPin, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/firebase';
import Navbar from '@/app/components/Navbar';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: any;
}

const PrivacySecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock sessions - in production, fetch from database/auth service
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Windows PC - Chrome',
      location: 'Mumbai, India',
      lastActive: 'Active now',
      current: true,
      icon: Monitor,
    },
    {
      id: '2',
      device: 'iPhone 13 - Safari',
      location: 'Mumbai, India',
      lastActive: '2 days ago',
      current: false,
      icon: Smartphone,
    },
  ]);

  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Are you sure you want to sign out from all devices? You will need to log in again.')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // In production, also revoke all refresh tokens on backend
      // await revokeAllSessions(user.uid);

      setMessage({ type: 'success', text: 'Signed out from all devices successfully!' });
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Logout all devices error:', error);
      setMessage({ type: 'error', text: 'Failed to sign out. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Privacy & Security</h1>
            <p className="text-gray-600">Manage your account security and active sessions</p>
          </div>

          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Account Security */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <button
                  onClick={() => navigate('/change-password')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded border border-green-200">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => alert('Coming soon')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h2>
            <p className="text-sm text-gray-600 mb-6">
              Manage devices where you're currently logged in
            </p>

            <div className="space-y-4 mb-6">
              {sessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{session.device}</p>
                          {session.current && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span>• {session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleLogoutAllDevices}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                'Sign Out From All Devices'
              )}
            </button>
          </div>

          {/* Login History */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Login History</h2>
            <p className="text-sm text-gray-600 mb-6">Recent login activity on your account</p>

            <div className="space-y-3">
              {[
                { date: 'Today, 10:30 AM', device: 'Windows PC', location: 'Mumbai, India', status: 'success' },
                { date: 'Yesterday, 8:45 PM', device: 'iPhone 13', location: 'Mumbai, India', status: 'success' },
                { date: '2 days ago, 9:15 AM', device: 'Windows PC', location: 'Mumbai, India', status: 'success' },
              ].map((login, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${login.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-gray-900 font-medium">{login.date}</p>
                      <p className="text-gray-600">{login.device} • {login.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
