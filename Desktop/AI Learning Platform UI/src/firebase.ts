import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration loaded from environment variables
// SECURITY: Keys are stored in .env (not in version control)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that required Firebase credentials are available
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is incomplete. Please check your .env file and ensure all VITE_FIREBASE_* variables are set."
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Set persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.log("Persistence Error:", err);
});

// Providers
export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();

// (IMPORTANT) Add scope for GitHub
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

export default app;
