import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  ChevronRight,
  Edit2,
  Lock,
  BookOpen,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Zap,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/app/components/Navbar';
import { AvatarEditor } from '@/app/components/AvatarEditor';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import {
  validateAvatarImage,
  createImagePreview,
  generateUsernameFromEmail,
} from '@/lib/avatarUtils';

interface ProfileStats {
  streak: number;
  coursesEnrolled: number;
  hoursLearned: number;
  achievements: number;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { uploadAvatar, isLoading: isUploading, error: uploadError, setError } = useAvatarUpload();
  
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const [stats, setStats] = useState<ProfileStats>({
    streak: 0,
    coursesEnrolled: 0,
    hoursLearned: 0,
    achievements: 0,
  });

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      // In a real app, fetch from Firebase/API
      setStats({
        streak: 12,
        coursesEnrolled: 3,
        hoursLearned: 24.5,
        achievements: 7,
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleChangePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate
      const error = validateAvatarImage(file);
      if (error) {
        setError(error);
        return;
      }

      // Create preview
      try {
        const preview = await createImagePreview(file);
        setImagePreview(preview);
        setEditorOpen(true);
      } catch (err) {
        setError('Failed to load image');
      }
    };

    input.click();
  };

  const handleAvatarEditorSave = async (editedFile: File) => {
    if (!user) return;
    
    try {
      const result = await uploadAvatar(editedFile, user);

      if (result.success) {
        // Refresh auth context to sync photoURL
        await refreshUser();
        
        setSuccessMessage('Avatar updated successfully!');
        setEditorOpen(false);
        setImagePreview('');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      // Error is already set by useAvatarUpload hook
    }
  };

  const getUserUsername = (): string => {
    // In a real app, fetch from Firestore
    return generateUsernameFromEmail(user?.email || '');
  };

  const extractNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const userName = user?.displayName || extractNameFromEmail(user?.email || '');
  const userEmail = user?.email || 'Not provided';
  const username = getUserUsername();

  const profileSections = [
    {
      icon: Edit2,
      label: 'Edit Profile',
      description: 'Update your name and profile information',
      action: () => navigate('/edit-profile'),
    },
    {
      icon: Lock,
      label: 'Change Password',
      description: 'Update your account password',
      action: () => navigate('/change-password'),
    },
    {
      icon: BookOpen,
      label: 'My Courses',
      description: 'View your enrolled courses and progress',
      action: () => navigate('/my-courses'),
    },
    {
      icon: CreditCard,
      label: 'Subscription & Plans',
      description: 'Manage your subscription and billing',
      action: () => navigate('/upgrade'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Configure notification preferences',
      action: () => navigate('/notifications-settings'),
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => navigate('/privacy-security'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: () => navigate('/support'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 pb-12 px-6 max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-start gap-6 mb-12 p-6 border border-gray-200 rounded-lg">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-72 mb-4 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Sections Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-3 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Success Toast */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error Toast */}
          {uploadError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center justify-between">
              <span>{uploadError}</span>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Avatar Editor Modal */}
          <AvatarEditor
            isOpen={editorOpen}
            imagePreview={imagePreview}
            onSave={handleAvatarEditorSave}
            onCancel={() => {
              setEditorOpen(false);
              setImagePreview('');
              setError(''); // Clear any errors
            }}
            error={uploadError}
            isUploading={isUploading}
          />

          {/* Profile Header */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex gap-6 flex-1">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-4xl font-semibold text-purple-700 border-2 border-purple-200 overflow-hidden shadow-md">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.displayName?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      'U'
                    )}
                  </div>

                  {/* Camera Icon Overlay */}
                  <button
                    onClick={handleChangePhoto}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 pt-1">
                  <h1 className="text-2xl font-semibold text-gray-900">{userName}</h1>
                  
                  {/* Clickable Username with External Icon */}
                  <div className="flex items-center gap-2 mt-2 group">
                    <button
                      onClick={() => navigate(`/user/${username}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      @{username}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mt-1">{userEmail}</p>
                  <div className="flex gap-3 mt-4">
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                      Free Account
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => navigate('/edit-profile')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Learning Streak
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {stats.streak}
              </p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Courses Enrolled
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {stats.coursesEnrolled}
              </p>
              <p className="text-xs text-gray-500 mt-1">active</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Hours Learned
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {stats.hoursLearned}
              </p>
              <p className="text-xs text-gray-500 mt-1">total</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Achievements
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {stats.achievements}
              </p>
              <p className="text-xs text-gray-500 mt-1">earned</p>
            </div>
          </div>

          {/* Current Plan Section */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-400" />
                  Current Plan
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  Free Account • Unlimited access to all courses
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">✓</span> Access to all courses
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">✓</span> Progress tracking
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">✓</span> Certificates
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/upgrade')}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex-shrink-0"
              >
                Upgrade Plan
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-1 mb-8">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-4 py-2 mb-2">
              Account Settings
            </h2>
            {profileSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={index}
                  onClick={section.action}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {section.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              );
            })}
          </div>

          {/* Logout Section */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                  Sign Out
                </p>
                <p className="text-xs text-gray-500 mt-0.5 group-hover:text-red-500">
                  Sign out from this device
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
