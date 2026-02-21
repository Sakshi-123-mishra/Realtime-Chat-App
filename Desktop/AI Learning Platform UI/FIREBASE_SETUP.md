# Firebase Authentication Setup Guide

## ✅ What Has Been Implemented

Your React + Vite + Firebase project now has a complete authentication system:

### 1. **Firebase Configuration** (`src/firebase.ts`)
- Firebase app initialization
- Authentication setup with session persistence
- Google and GitHub OAuth providers configured

### 2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
- Centralized authentication state management
- Email/Password signup and login
- Google OAuth login
- GitHub OAuth login
- Logout functionality
- Session persistence across browser sessions

### 3. **Protected Routes** (`src/app/components/ProtectedRoute.tsx`)
- Automatic redirect to login for unauthenticated users
- Protects all dashboard, learning, and account pages

### 4. **Updated Pages**
- **LoginPage**: Firebase email/password + Google + GitHub login
- **SignupPage**: Firebase email/password + Google + GitHub signup
- **DashboardPage**: Uses real Firebase user data
- **Navbar**: Logout button with Firebase integration
- **App.tsx**: Wrapped with AuthProvider and protected routes

### 5. **Fixed Issues**
- ✅ Removed all localStorage-based fake authentication
- ✅ Fixed broken `figma:asset` image imports → now uses `@/assets/logo.png`
- ✅ Proper redirects: Login → Dashboard, Unauthenticated → Login
- ✅ Firebase package installed

---

## 🔧 Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select existing project
3. Enable Google Analytics (optional)
4. Click "Create Project"

### Step 2: Register Your Web App

1. In Firebase Console, click the **Web** icon (`</>`)
2. Register app with a nickname (e.g., "E-Learn Web App")
3. **Copy the Firebase configuration** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3: Update Firebase Config

1. Open `src/firebase.ts`
2. **Replace** the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // Replace this
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",   // Replace this
  projectId: "YOUR_ACTUAL_PROJECT_ID",     // Replace this
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

### Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following:

#### **Email/Password**
- Click "Email/Password"
- Toggle **Enable**
- Click "Save"

#### **Google**
- Click "Google"
- Toggle **Enable**
- Add support email (your email)
- Click "Save"

#### **GitHub**
- Click "GitHub"
- Toggle **Enable**
- You'll need to:
  1. Go to GitHub → Settings → Developer Settings → OAuth Apps
  2. Create new OAuth App
  3. Copy Client ID and Client Secret
  4. Paste in Firebase
  5. Copy the Authorization callback URL from Firebase
  6. Add it to your GitHub OAuth App
- Click "Save"

### Step 5: Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add:
   - `localhost` (for development)
   - Your production domain (when you deploy)

---

## 🚀 Running the Project

```bash
# Install dependencies (if not done)
npm install

# Run development server
npm run dev
```

Your app should start at `http://localhost:5173` (or similar)

---

## 🧪 Testing Authentication

### Test Email/Password Signup:
1. Go to `/signup`
2. Fill in name, email, password
3. Password must meet requirements (8+ chars, uppercase, number, special char)
4. Click "Create Account"
5. Should redirect to `/dashboard`

### Test Email/Password Login:
1. Go to `/login`
2. Enter email and password
3. Click "Login"
4. Should redirect to `/dashboard`

### Test Google Login:
1. Click "Google" button on login or signup page
2. Select Google account
3. Should redirect to `/dashboard`

### Test GitHub Login:
1. Click "GitHub" button on login or signup page
2. Authorize with GitHub
3. Should redirect to `/dashboard`

### Test Logout:
1. In Dashboard, click "Logout" in navbar
2. Should redirect to `/login`
3. Try accessing `/dashboard` → should redirect to `/login`

### Test Protected Routes:
1. Log out
2. Try accessing any of these URLs directly:
   - `/dashboard`
   - `/build-companion`
   - `/journey`
   - `/account`
3. All should redirect to `/login`

---

## 📁 Project Structure

```
src/
├── firebase.ts                     # Firebase configuration
├── contexts/
│   └── AuthContext.tsx            # Authentication context & provider
├── app/
│   ├── App.tsx                    # Main app with AuthProvider
│   ├── components/
│   │   ├── ProtectedRoute.tsx     # Route protection component
│   │   └── Navbar.tsx             # Navbar with logout
│   └── pages/
│       ├── LoginPage.tsx          # Login with Firebase
│       ├── SignupPage.tsx         # Signup with Firebase
│       ├── DashboardPage.tsx      # Protected dashboard
│       └── ...other pages
└── assets/
    └── logo.png                   # App logo
```

---

## 🔐 Security Notes

1. **Never commit `firebase.ts` with real credentials to public repos**
   - Use environment variables for production
   - Add `.env` to `.gitignore`

2. **Firebase Rules**: Set up Firestore/Storage rules when you add those features

3. **Email Verification**: Consider adding email verification for production:
   ```typescript
   await sendEmailVerification(userCredential.user);
   ```

---

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
→ You haven't replaced the placeholder config in `src/firebase.ts`

### "Firebase: Error (auth/unauthorized-domain)"
→ Add your domain to Firebase Console → Authentication → Authorized domains

### "Network error" during login
→ Check your internet connection and Firebase project settings

### Google/GitHub login popup blocked
→ Allow popups in your browser for localhost

### User is null after refresh
→ This is normal on first load - AuthContext shows loading state

---

## 📦 Dependencies Installed

```json
{
  "firebase": "^11.1.0"  // Latest Firebase SDK
}
```

---

## ✨ Features Ready to Use

- ✅ Email/Password authentication
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Session persistence
- ✅ Protected routes
- ✅ User state management
- ✅ Automatic redirects
- ✅ Error handling with user-friendly messages
- ✅ Loading states
- ✅ Logout functionality

---

## 🎯 Next Steps (Optional)

1. **Email Verification**: Add email verification for new signups
2. **Password Reset**: Implement "Forgot Password" functionality
3. **User Profile**: Store additional user data in Firestore
4. **Profile Pictures**: Upload user avatars to Firebase Storage
5. **Environment Variables**: Move Firebase config to `.env` file
6. **Production Deploy**: Deploy to Vercel, Netlify, or Firebase Hosting

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Check browser console for detailed error messages
3. Verify Firebase config is correctly set up
4. Ensure all authentication methods are enabled in Firebase

---

**Your Firebase authentication system is production-ready! 🚀**
