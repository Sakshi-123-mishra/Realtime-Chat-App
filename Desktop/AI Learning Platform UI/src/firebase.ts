import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration (Better: env se lo, but abhi direct ok hai)
const firebaseConfig = {
  apiKey: "AIzaSyADPFl6S7-kd6lA4H0o2AXRH1-_W58U79k",
  authDomain: "e-learn-66675.firebaseapp.com",
  projectId: "e-learn-66675",
  storageBucket: "e-learn-66675.firebasestorage.app",
  messagingSenderId: "1070985955115",
  appId: "1:1070985955115:web:71cfe7f15f18f1496d676e",
  measurementId: "G-1739E5XBP0",
};

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
