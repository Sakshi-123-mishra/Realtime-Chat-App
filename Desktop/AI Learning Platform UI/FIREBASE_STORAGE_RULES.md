# Firebase Storage Security Rules Fix

## Current Issue
Photo upload is failing silently. This is usually because **Firebase Storage Rules are blocking write access**.

## Solution
Go to your Firebase Console and update Storage Rules:

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select Project**: e-learn-66675
3. **Go to**: Storage → Rules
4. **Replace all rules with this:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read/write their own profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny for everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

5. **Click "Publish"**
6. **Wait 2-3 minutes** for rules to deploy
7. **Refresh your app** and try uploading again

## What These Rules Do
- ✅ Authenticated users can upload to their own `profile-photos/{userId}` folder
- ✅ Users can read/delete their own photos
- ✅ Everyone blocks from accessing others' photos
- ✅ Everything else is denied by default

## Troubleshooting Steps
If upload still doesn't work after updating rules:

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try uploading a photo**
4. **Look for error messages** - copy them
5. **Check Network tab** → look for Firebase Storage API calls

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `storage/unauthorized` | Rules blocking write | Update rules above |
| `storage/invalid-argument` | File path issue | Check userId is valid |
| `storage/unauthenticated` | User not logged in | Make sure you're logged in |
| `storage/unknown` | Network or other issue | Check console for details |

