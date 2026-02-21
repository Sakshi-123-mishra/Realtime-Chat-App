# 🔥 Firebase Quick Start

## ⚡ Quick Setup (5 minutes)

### 1. Get Firebase Config
```bash
1. Go to: https://console.firebase.google.com/
2. Create/Select project
3. Click Web icon (</>)
4. Copy the firebaseConfig object
```

### 2. Update Config
Open: `src/firebase.ts`

Replace:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← Paste your values here
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Enable Auth Methods
```bash
Firebase Console → Authentication → Sign-in method
Enable: Email/Password ✓
Enable: Google ✓
Enable: GitHub ✓ (requires GitHub OAuth app)
```

### 4. Run App
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 🎯 Test Checklist

- [ ] Signup with email/password
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Login with GitHub (if configured)
- [ ] Logout
- [ ] Try accessing /dashboard when logged out (should redirect to /login)

## 🚨 Common Issues

**"Error: Firebase config not found"**
→ Update src/firebase.ts with your config

**"Error: unauthorized-domain"**
→ Add localhost to Firebase Console → Authentication → Authorized domains

**GitHub login not working**
→ Create GitHub OAuth App and add credentials to Firebase

## 📖 Full Documentation

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions.

---

**You're all set! 🚀**
