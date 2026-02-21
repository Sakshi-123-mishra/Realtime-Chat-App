import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  UserCredential,
  browserPopupRedirectResolver,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth, googleProvider, githubProvider } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name?: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithGithub: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Signup
  const signup = async (
    email: string,
    password: string,
    name?: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await userCredential.user.reload();
      setUser(auth.currentUser);
    }

    return userCredential;
  };

  // Login
  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = async (): Promise<UserCredential> => {
    try {
      return await signInWithPopup(
        auth,
        googleProvider,
        browserPopupRedirectResolver
      );
    } catch (error: any) {
      console.error("Google Login Error:", error.code, error.message);
      throw error;
    }
  };

  // GitHub Login (IMPORTANT FIX)
  const loginWithGithub = async (): Promise<UserCredential> => {
    try {
      return await signInWithPopup(
        auth,
        githubProvider,
        browserPopupRedirectResolver
      );
    } catch (error: any) {
      if (error?.code === "auth/account-exists-with-different-credential") {
        const email = error?.customData?.email as string | undefined;
        const pendingCred = GithubAuthProvider.credentialFromError(error);

        if (email && pendingCred) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes(GoogleAuthProvider.PROVIDER_ID)) {
            const googleResult = await signInWithPopup(
              auth,
              googleProvider,
              browserPopupRedirectResolver
            );

            await linkWithCredential(googleResult.user, pendingCred);
            return googleResult;
          }
        }
      }

      console.error("GitHub Login Error:", error.code, error.message);
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    return await signOut(auth);
  };

  // Refresh current user data (e.g., updated photoURL)
  const refreshUser = async (): Promise<void> => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser(auth.currentUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    refreshUser,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
