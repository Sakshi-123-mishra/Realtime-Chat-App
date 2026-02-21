# Cloudinary Integration Guide

## ✅ Setup Complete

Your project is now configured to use **Cloudinary** for profile photo uploads instead of Firebase Storage.

---

## 📁 File Locations

### 1. Environment Variables
**File:** [.env](.env)
```env
VITE_CLOUDINARY_CLOUD_NAME=dzntkl93n
VITE_CLOUDINARY_UPLOAD_PRESET=profile_pics
```

**Location:** Project root directory  
**Access in code:** `import.meta.env.VITE_CLOUDINARY_CLOUD_NAME`

### 2. Cloudinary Utility
**File:** [src/lib/cloudinary.ts](src/lib/cloudinary.ts)

Functions:
- `uploadToCloudinary(file, onProgress)` - Upload with progress tracking
- `validateImage(file)` - Validate format and size
- `getCloudinaryUrl(publicId, width, height)` - Get optimized URL

### 3. Edit Profile Page
**File:** [src/app/pages/EditProfilePage.tsx](src/app/pages/EditProfilePage.tsx)

Uses Cloudinary for photo upload and Firebase Auth for profile update.

---

## 🚀 Dev Server Restart

**⚠️ REQUIRED:** After modifying `.env`, you MUST:

```bash
# 1. Stop the dev server (Ctrl+C)
# 2. Clear npm cache (optional)
npm cache clean --force

# 3. Restart dev server
npm run dev
```

The dev server watches for changes, but `.env` changes require a full restart for Vite to reload environment variables.

---

## 📝 Usage Example

```typescript
import { uploadToCloudinary, validateImage } from '@/lib/cloudinary';

// In your upload handler:
const handleUpload = async (file: File) => {
  // Validate before upload
  const error = validateImage(file);
  if (error) {
    setError(error);
    return;
  }

  try {
    // Upload to Cloudinary with progress
    const response = await uploadToCloudinary(file, (progress) => {
      console.log(`${progress.percent}% uploaded`);
    });

    // response.secure_url is your image URL
    console.log('Image URL:', response.secure_url);
    
    // Update Firebase Auth profile
    await updateProfile(user, { photoURL: response.secure_url });
  } catch (err) {
    console.error('Upload failed:', err);
  }
};
```

---

## 🔒 Security

### What's Exposed (Safe)
- ✅ Cloud Name: `dzntkl93n` - Public, cannot harm
- ✅ Upload Preset: `profile_pics` - Preset restriction

### What's NOT Exposed (Protected)
- ❌ API Secret - NEVER in frontend
- ❌ API Key - NOT used in frontend
- ✅ Unsigned uploads only (no credentials needed)

### Upload Preset Restrictions
Your `profile_pics` preset should be configured in Cloudinary Dashboard with:
- Allowed formats: JPG, PNG, WEBP
- Max file size: 5MB
- Folder: `profile-photos`
- Transformations: Auto quality, auto format

---

## 📊 Features Implemented

✅ **File Validation**
- Format: JPG, PNG, WEBP only
- Max size: 5MB
- Error messages for each case

✅ **Upload Progress**
- Real-time percentage display
- Progress bar visualization
- Cancel capability

✅ **Modal Behavior**
- Close via X button
- Close via Cancel button
- Close by clicking outside
- Full state reset on close

✅ **Integration**
- Cloudinary URL stored in Firebase Auth profile
- Auto-refresh after upload
- Persists across sessions

✅ **Error Handling**
- Network errors
- Invalid file format
- File too large
- User-friendly messages

---

## 🎨 Cloudinary Features Available

### Transformations
Use `getCloudinaryUrl()` for optimized images:

```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Get optimized 500x500 image
const url = getCloudinaryUrl('profile-photos/user123', 500, 500);

// With quality parameter
const urlAuto = getCloudinaryUrl('profile-photos/user123', 500, 500, 'auto');
```

### Direct Upload Response
Every upload returns:
```typescript
{
  public_id: string;       // Unique ID
  secure_url: string;      // HTTPS URL (use this!)
  url: string;             // HTTP URL (avoid)
  format: string;          // jpg, png, webp
  width: number;           // Image width
  height: number;          // Image height
  bytes: number;           // File size
}
```

---

## 🐛 Troubleshooting

### Upload Fails with "Configuration missing"
- Check `.env` file has both variables
- Restart dev server: `npm run dev`
- Check console for error details

### Upload Fails with "Network error"
- Check internet connection
- Verify Cloudinary API is accessible
- Check CORS settings in Cloudinary Dashboard

### Upload Fails with "Invalid format"
- Only JPG, PNG, WEBP allowed
- Check file MIME type is correct
- Some browsers may report wrong MIME type

### File Size Error
- Maximum 5MB allowed
- Compress image before upload
- Use Cloudinary's auto-quality feature

### Progress Bar Stuck
- Browser canceled upload
- Network timeout
- Close modal to reset

---

## 📚 Useful Links

- **Cloudinary Dashboard:** https://cloudinary.com/console/
- **Upload Preset Settings:** https://cloudinary.com/console/settings/upload
- **API Documentation:** https://cloudinary.com/documentation/upload_widget
- **Vite Env Variables:** https://vitejs.dev/guide/env-and-modes.html

---

## ✨ What Works Now

✅ Select image → Preview → Upload with progress → Success  
✅ Modal closes properly  
✅ Photo updates immediately  
✅ Persists on page reload  
✅ Error messages clear  
✅ Remove photo functionality  

---

**Setup Complete!** Your profile photo upload system is now live and using Cloudinary. 🎉
