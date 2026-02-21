/**
 * Avatar Utilities
 * Image validation, processing, and Cloudinary URL optimization
 */

/**
 * Validate image file
 */
export const validateAvatarImage = (file: File): string => {
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
 * Create image preview from file
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get optimized Cloudinary URL for avatar
 */
export const getCloudinaryAvatarUrl = (
  publicId: string,
  width: number = 400,
  height: number = 400,
  quality: string = 'auto'
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/${publicId}`;
};

/**
 * Auto-generate username from email
 */
export const generateUsernameFromEmail = (email: string): string => {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
};

/**
 * Validate username
 */
export const validateUsername = (username: string): string => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 30) return 'Username must be at most 30 characters';
  if (!/^[a-z0-9_]+$/.test(username)) {
    return 'Username can only contain lowercase letters, numbers, and underscores';
  }
  return '';
};
