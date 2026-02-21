import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, setDoc, getFirestore } from 'firebase/firestore';
import { ArrowLeft, Loader2, Phone, Github, Linkedin, Briefcase, MapPin, Calendar, User2, Globe, Twitter, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { AvatarEditor } from '@/app/components/AvatarEditor';
import { validateAvatarImage, createImagePreview } from '@/lib/avatarUtils';
import app from '@/firebase';
import Navbar from '@/app/components/Navbar';


const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { uploadAvatar, isLoading: isUploading, error: uploadError, setError } = useAvatarUpload();
  
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editorOpen, setEditorOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    jobTitle: '',
    company: '',
    location: '',
    bio: '',
    website: '',
    githubProfile: '',
    linkedinProfile: '',
    twitterProfile: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update Firebase Auth profile (displayName only - photo is handled separately)
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // TODO: In production, save additional fields to Firestore
      // Example:
      // await setDoc(doc(db, 'users', user.uid), {
      //   username: formData.username,
      //   phoneNumber: formData.phoneNumber,
      //   dateOfBirth: formData.dateOfBirth,
      //   gender: formData.gender,
      //   jobTitle: formData.jobTitle,
      //   company: formData.company,
      //   location: formData.location,
      //   bio: formData.bio,
      //   website: formData.website,
      //   githubProfile: formData.githubProfile,
      //   linkedinProfile: formData.linkedinProfile,
      //   twitterProfile: formData.twitterProfile,
      // }, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Redirect back to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Update profile error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = () => {
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
        
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        setEditorOpen(false);
        setImagePreview('');
      } else {
        setMessage({ type: 'error', text: uploadError || 'Failed to upload avatar' });
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setMessage({ type: 'error', text: 'Failed to upload avatar. Please try again.' });
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !user.photoURL) return;

    setPhotoLoading(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { photoURL: null });
      
      // Update Firestore user document
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', user.uid);
      
      try {
        await updateDoc(userDocRef, {
          photoURL: null,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        // If document doesn't exist, create it without photoURL
        await setDoc(
          userDocRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
      
      await user.reload();

      setMessage({ type: 'success', text: 'Profile photo removed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove photo. Please try again.' });
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Edit Profile</h1>

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

          {/* Avatar Editor */}
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

          {/* Upload Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo - Professional Upload */}
            <div className="border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-900 mb-6">
                Profile Photo
              </label>

              <div className="flex items-end gap-8">
                {/* Avatar Preview */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-3xl font-semibold text-purple-700 border-2 border-purple-200 overflow-hidden flex-shrink-0 shadow-md">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      formData.displayName?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  {/* Camera Icon Overlay */}
                  <button
                    type="button"
                    onClick={handlePhotoSelect}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handlePhotoSelect}
                    disabled={isUploading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>

                  {user?.photoURL && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={photoLoading}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors border border-red-200 disabled:opacity-50"
                    >
                      Remove Photo
                    </button>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or WEBP • Max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Personal Information
              </h3>
              
              {/* Display Name & Email - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Username & Phone - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <User2 className="w-4 h-4 inline mr-1" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="@username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gender & Date of Birth - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <User2 className="w-4 h-4 inline mr-1" />
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location - Full width */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Professional Information
              </h3>
              
              {/* Job Title & Company - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                    placeholder="e.g. Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g. Google"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  About / Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Write a short bio about yourself..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {formData.bio.length} / 500 characters
                </p>
              </div>
            </div>

            {/* Social & Web Profiles Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Social & Web Profiles
              </h3>
              
              {/* Website & GitHub - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website / Portfolio
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Github className="w-4 h-4 inline mr-1" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={formData.githubProfile}
                    onChange={(e) =>
                      setFormData({ ...formData, githubProfile: e.target.value })
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* LinkedIn & Twitter - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-1" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinProfile: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Twitter className="w-4 h-4 inline mr-1" />
                    Twitter Profile
                  </label>
                  <input
                    type="url"
                    value={formData.twitterProfile}
                    onChange={(e) =>
                      setFormData({ ...formData, twitterProfile: e.target.value })
                    }
                    placeholder="https://twitter.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
