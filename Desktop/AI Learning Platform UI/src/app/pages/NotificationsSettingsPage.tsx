import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Bell, Mail, MessageSquare, Award } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

interface NotificationSetting {
  id: string;
  category: string;
  icon: any;
  settings: {
    email: boolean;
    push: boolean;
  };
}

const NotificationsSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'course_updates',
      category: 'Course Updates',
      icon: BookOpen,
      settings: { email: true, push: true },
    },
    {
      id: 'achievements',
      category: 'Achievements & Milestones',
      icon: Award,
      settings: { email: true, push: false },
    },
    {
      id: 'messages',
      category: 'Messages & Comments',
      icon: MessageSquare,
      settings: { email: false, push: true },
    },
    {
      id: 'reminders',
      category: 'Study Reminders',
      icon: Bell,
      settings: { email: true, push: true },
    },
  ]);

  const handleToggle = (id: string, type: 'email' | 'push') => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              settings: { ...notif.settings, [type]: !notif.settings[type] },
            }
          : notif
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call - replace with actual Firestore/API update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, save to database:
      // await updateDoc(doc(db, 'users', user.uid), { notificationSettings: notifications });

      setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Notification Settings</h1>
            <p className="text-gray-600">Manage how you receive notifications</p>
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

          {/* Notification Categories */}
          <div className="space-y-4 mb-8">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div key={notif.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{notif.category}</h3>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Email Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email</span>
                        <button
                          onClick={() => handleToggle(notif.id, 'email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notif.settings.email ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notif.settings.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </label>

                      {/* Push Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Push</span>
                        <button
                          onClick={() => handleToggle(notif.id, 'push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notif.settings.push ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notif.settings.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import fix
import { BookOpen } from 'lucide-react';

export default NotificationsSettingsPage;
