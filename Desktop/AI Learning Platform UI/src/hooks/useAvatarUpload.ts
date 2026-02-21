/**
 * Avatar Upload Hook
 * Handles Cloudinary upload + Firebase Auth + Firestore sync
 */

import { useState } from 'react';
import { User, updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
import app from '@/firebase';

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export const useAvatarUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const uploadToCloudinary = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ secure_url: string; public_id: string }> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET. Add them to your .env file and restart the dev server.'
      );
    }

    // Cloudinary unsigned upload endpoint example:
    // POST https://api.cloudinary.com/v1_1/<cloudName>/image/upload
    // FormData: file, upload_preset, folder
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    console.info('[Cloudinary] Upload request', {
      uploadUrl,
      hasUploadPreset: Boolean(uploadPreset),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'profile-avatars');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress?.({
            percent,
            loaded: e.loaded,
            total: e.total,
          });
        }
      });

      // Success
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.info('[Cloudinary] Upload response', response);
            resolve({
              secure_url: response.secure_url,
              public_id: response.public_id,
            });
          } catch (err) {
            console.error('[Cloudinary] Failed to parse response', err);
            reject(new Error('Failed to parse Cloudinary response'));
          }
        } else {
          console.error('[Cloudinary] Upload failed', {
            status: xhr.status,
            responseText: xhr.responseText,
          });
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // Error
      xhr.addEventListener('error', () => {
        console.error('[Cloudinary] Network error during upload');
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        console.warn('[Cloudinary] Upload cancelled');
        reject(new Error('Upload cancelled'));
      });

      // Send
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });
  };

  const updateFirebaseProfile = async (
    user: User,
    photoURL: string
  ): Promise<void> => {
    // Update Firebase Auth profile
    console.info('[Firebase] Updating Auth profile photoURL');
    await updateProfile(user, { photoURL });

    // Update Firestore user document
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      // Try updating existing document
      console.info('[Firebase] Updating Firestore user document');
      await updateDoc(userDocRef, {
        photoURL,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Firebase] Firestore document missing, creating one', err);
      // If document doesn't exist, create it
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  const uploadAvatar = async (
    file: File,
    user: User | null,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ success: boolean; photoURL?: string }> => {
    if (!user) {
      setError('Please log in to upload an avatar');
      return { success: false };
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate file
      const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validFormats.includes(file.type)) {
        throw new Error('Invalid format. Please upload JPG, PNG, or WEBP image.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum 5MB allowed.');
      }

      // Upload to Cloudinary
      console.info('[AvatarUpload] Starting Cloudinary upload');
      const cloudinaryResponse = await uploadToCloudinary(file, onProgress);

      // Update Firebase
      console.info('[AvatarUpload] Updating Firebase profile');
      await updateFirebaseProfile(user, cloudinaryResponse.secure_url);

      // Reload user to reflect changes
      console.info('[AvatarUpload] Reloading user');
      await user.reload();

      setSuccess(true);
      return {
        success: true,
        photoURL: cloudinaryResponse.secure_url,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload avatar';
      console.error('[AvatarUpload] Upload failed', err);
      setError(errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadAvatar,
    isLoading,
    error,
    success,
    setError,
  };
};
