import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
import app from '@/firebase';
import { Camera, X, Loader2, AlertCircle } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

interface ProfilePhotoUploadProps {
  onPhotoUpdate?: (photoURL: string) => void;
}

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SuccessToast = ({ message }: { message: string }) => (
  <div className="mt-3 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
    {message}
  </div>
);

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ onPhotoUpdate }) => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successTimerRef = useRef<number | null>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [localPhotoURL, setLocalPhotoURL] = useState<string | null>(null);

  const { uploadAvatar, isLoading: isUploading, error, setError } = useAvatarUpload();
  const isBusy = isUploading || isRemoving;

  // Get user's current photo or initials
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || 'U';
  const photoURL = (localPhotoURL ?? user?.photoURL) || null;

  useEffect(() => {
    setLocalPhotoURL(user?.photoURL || null);
  }, [user?.photoURL]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = window.setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return 'Invalid format. Please upload JPG, PNG, or WEBP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum 5MB allowed.';
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError('');

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setShowPreview(true);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    (fileInputRef.current as any).selectedFile = file;
  };

  const handleUpload = async () => {
    if (!user || !preview) return;

    const file = (fileInputRef.current as any)?.selectedFile;
    if (!file) return;

    setError('');

    try {
      const result = await uploadAvatar(file, user);

      if (!result.success || !result.photoURL) {
        return;
      }

      // Update UI instantly
      setLocalPhotoURL(result.photoURL);
      onPhotoUpdate?.(result.photoURL);

      // Refresh auth context to keep in sync
      await refreshUser();

      // Close modal and reset state
      setPreview(null);
      setShowPreview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      showSuccess('Profile photo updated successfully');
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Upload error:', error);
      setError('Failed to upload photo. Please try again.');
    } finally {
      // Loading state is handled by hook; this ensures flow completes
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setShowPreview(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !photoURL) return;

    setIsRemoving(true);
    setError('');

    try {
      // Update profile to remove photoURL
      await updateProfile(user, {
        photoURL: null,
      });

      // Update Firestore user document
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          photoURL: '',
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        await setDoc(
          userDocRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: '',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Reload user
      await user.reload();

      // Call callback
      onPhotoUpdate?.('');

      setLocalPhotoURL(null);
      showSuccess('Profile photo removed successfully');
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Remove photo error:', error);
      setError('Failed to remove photo. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="relative group">
      {/* Avatar Display */}
      <div className="relative w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
        {photoURL ? (
          <img 
            src={photoURL} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-semibold text-gray-700">
            {userInitial}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload profile photo"
        />

        {/* Click Area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Change profile photo"
        />
      </div>

      {/* Success Message */}
      {successMessage && !showPreview && (
        <SuccessToast message={successMessage} />
      )}

      {/* Preview Modal */}
      {showPreview && preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Preview Photo
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Image */}
            <div className="px-6 py-4">
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Info Text */}
              <p className="text-sm text-gray-600 mb-4">
                This image will be set as your profile photo. Make sure you're happy with how it looks.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Photo Button (shown only if photo exists) */}
      {photoURL && !showPreview && (
        <button
          onClick={handleRemovePhoto}
          disabled={isBusy}
          className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-0"
          title="Remove photo"
        >
          {isBusy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
