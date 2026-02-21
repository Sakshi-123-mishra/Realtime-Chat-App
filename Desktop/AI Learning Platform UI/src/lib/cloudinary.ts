/**
 * Cloudinary Upload Utility
 * Handles profile photo uploads to Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload file to Cloudinary with progress tracking
 * @param file - File to upload
 * @param onProgress - Callback for progress updates
 * @returns Promise with Cloudinary response
 */
export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration missing. Check .env file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'profile-photos');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percent,
        });
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          resolve(response);
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    // Send request
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Validate image before upload
 * @param file - File to validate
 * @returns Error message or empty string
 */
export const validateImage = (file: File): string => {
  const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validFormats.includes(file.type)) {
    return 'Invalid format. Please upload JPG, PNG, or WEBP image.';
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'File size too large. Maximum 5MB allowed.';
  }

  return '';
};

/**
 * Get Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param width - Image width
 * @param height - Image height
 * @param quality - Image quality (default: auto)
 * @returns Cloudinary URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  width: number = 500,
  height: number = 500,
  quality: string = 'auto'
): string => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality}/${publicId}`;
};
