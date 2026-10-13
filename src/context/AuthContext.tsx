import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  logOut,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
    company?: string,
    phone?: string
  ) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  signInDemo: (role?: 'admin' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  signInDemo: async () => {},
  signOut: async () => {},
  updateProfileData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Friendly helper for Firebase Auth error codes
function mapAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your details.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact manager@servicewebsites.co.za.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a few moments and try again.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in popup was cancelled.';
    default:
      return err?.message || 'Authentication encountered an unexpected error. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        // Listen to live updates of the logged-in user profile
        unsubscribeDoc = onSnapshot(
          userDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              setProfile(snapshot.data() as UserProfile);
            } else {
              // Create initial profile for newly signed-up user
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || 'manager@servicewebsites.co.za',
                displayName: firebaseUser.displayName || 'Service Websites Member',
                photoURL:
                  firebaseUser.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
                role:
                  firebaseUser.email === 'manager@servicewebsites.co.za' ||
                  firebaseUser.email === 'servicewebsites6@gmail.com'
                    ? 'admin'
                    : 'client',
                company: 'Service Websites Partner',
                bio: 'Passionate about high-performing web experiences and digital growth.',
                phone: '060 137 5180',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              };

              try {
                await setDoc(userDocRef, newProfile);
                setProfile(newProfile);
              } catch (err) {
                // Non-fatal profile creation fallback
                setProfile(newProfile);
              }
            }
            setLoading(false);
          },
          () => {
            setLoading(false);
          }
        );
      } else {
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // Standard 1-Click Google Sign In (Clean, standard scopes)
  const signIn = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res) {
        setLoading(false);
        return { success: false, error: 'Sign in was cancelled.' };
      }
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      const message = mapAuthError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Email & Password
  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      setUser(userCredential.user);
      return { success: true };
    } catch (err: any) {
      const errorMsg = mapAuthError(err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email & Password
  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    company?: string,
    phone?: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim() || 'Service Websites Member';

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const newUser = userCredential.user;

      // Update auth profile
      const photoURL = `https://api.dicebear.com/7.x/bottts/svg?seed=${newUser.uid}`;
      try {
        await updateAuthProfile(newUser, {
          displayName: trimmedName,
          photoURL,
        });
      } catch {
        // Non-fatal
      }

      // Create profile document in Firestore
      const newProfile: UserProfile = {
        uid: newUser.uid,
        email: trimmedEmail,
        displayName: trimmedName,
        photoURL,
        role:
          trimmedEmail === 'manager@servicewebsites.co.za' ||
          trimmedEmail === 'servicewebsites6@gmail.com'
            ? 'admin'
            : 'client',
        company: company?.trim() || 'Service Websites Partner',
        phone: phone?.trim() || '060 137 5180',
        bio: 'Client account registered with Service Websites Agency.',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      try {
        const userDocRef = doc(db, 'users', newUser.uid);
        await setDoc(userDocRef, newProfile);
      } catch {
        // Non-fatal
      }

      setUser(newUser);
      setProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      const errorMsg = mapAuthError(err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Password Reset Email
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: mapAuthError(err) };
    }
  };

  // Demo Sign-In
  const signInDemo = async (role: 'admin' | 'client' = 'admin') => {
    setLoading(true);
    const demoUid = 'servicewebsites_admin_demo';
    const demoProfile: UserProfile = {
      uid: demoUid,
      email: role === 'admin' ? 'manager@servicewebsites.co.za' : 'client@servicewebsites.co.za',
      displayName: role === 'admin' ? 'Service Websites Agency' : 'Client Partner',
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: role,
      company: 'Service Websites Agency (Pty) Ltd',
      bio: 'Leading web design, local SEO, and software agency in Rustenburg, South Africa.',
      phone: '060 137 5180',
      status: 'active',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    try {
      const userDocRef = doc(db, 'users', demoUid);
      await setDoc(userDocRef, demoProfile, { merge: true });
    } catch {
      // Offline fallback
    }

    setProfile(demoProfile);
    setLoading(false);
  };

  // Full Log Out
  const signOutUser = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch {
      // Ignore
    }
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  // Update Profile Data
  const updateProfileData = async (updates: Partial<UserProfile>) => {
    const activeUid = user?.uid || profile?.uid;
    if (!activeUid) return;

    const userDocRef = doc(db, 'users', activeUid);
    const updatedPayload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(userDocRef, updatedPayload);

      if (user && (updates.displayName || updates.photoURL)) {
        await updateAuthProfile(user, {
          displayName: updates.displayName ?? user.displayName,
          photoURL: updates.photoURL ?? user.photoURL,
        });
      }
    } catch {
      // Offline fallback
    }

    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signInDemo,
        signOut: signOutUser,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
