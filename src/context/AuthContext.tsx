import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  logOut,
} from '../lib/firebase';
import { logActivity } from '../lib/activityLogger';
import { UserProfile } from '../types';

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface PendingSignUpDetails {
  displayName: string;
  company: string;
  phone: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
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
  updateProfileData: (data: Partial<UserProfile>) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  signInDemo: async () => {},
  signOut: async () => {},
  updateProfileData: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

// Friendly helper for Firebase Auth error codes
function mapAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
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
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled on this Firebase project yet. Please sign in with Google or Demo access.';
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
  const pendingSignUpRef = useRef<Record<string, PendingSignUpDetails>>({});

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const normalizedEmail = (firebaseUser.email || '').trim().toLowerCase();

        // Listen to live updates of the logged-in user profile
        unsubscribeDoc = onSnapshot(
          userDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              setProfile(snapshot.data() as UserProfile);
              delete pendingSignUpRef.current[normalizedEmail];
            } else {
              const pending = pendingSignUpRef.current[normalizedEmail];
              const nowIso = new Date().toISOString();
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || 'manager@servicewebsites.co.za',
                displayName:
                  pending?.displayName ||
                  firebaseUser.displayName ||
                  (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Service Websites Member'),
                photoURL:
                  firebaseUser.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
                role:
                  normalizedEmail === 'manager@servicewebsites.co.za' ||
                  normalizedEmail === 'servicewebsites6@gmail.com'
                    ? 'admin'
                    : 'client',
                company: pending?.company || 'Service Websites Partner',
                bio: 'Client account registered with Service Websites Agency.',
                phone: pending?.phone || '060 137 5180',
                status: 'active',
                emailVerified: firebaseUser.emailVerified || false,
                createdAt: nowIso,
                updatedAt: nowIso,
                lastLoginAt: nowIso,
              };

              try {
                await setDoc(userDocRef, newProfile);
                setProfile(newProfile);
                delete pendingSignUpRef.current[normalizedEmail];
                await logActivity({
                  type: 'user_signup',
                  title: 'New Account Registered',
                  description: `${newProfile.displayName} joined Service Websites.`,
                  actorName: newProfile.displayName,
                  actorPhoto: newProfile.photoURL,
                  targetId: newProfile.uid,
                });
              } catch {
                // Local fallback so UI stays responsive even if offline
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
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // Standard 1-Click Google Sign In
  const signIn = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res) {
        return { success: false, error: 'Sign in was cancelled.' };
      }
      try {
        await updateDoc(doc(db, 'users', res.user.uid), {
          lastLoginAt: new Date().toISOString(),
        });
      } catch {
        // Doc may be created by onSnapshot listener
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: mapAuthError(err) };
    } finally {
      setLoading(false);
    }
  };

  // Log in with Email & Password
  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      setUser(userCredential.user);
      try {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: new Date().toISOString(),
        });
      } catch {
        // Non-fatal
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: mapAuthError(err) };
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
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim() || 'Service Websites Member';

    // Store pending details before createUserWithEmailAndPassword so onAuthStateChanged doesn't race with defaults
    pendingSignUpRef.current[trimmedEmail] = {
      displayName: trimmedName,
      company: company?.trim() || 'Service Websites Partner',
      phone: phone?.trim() || '060 137 5180',
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const newUser = userCredential.user;

      const photoURL = `https://api.dicebear.com/7.x/bottts/svg?seed=${newUser.uid}`;
      try {
        await updateAuthProfile(newUser, {
          displayName: trimmedName,
          photoURL,
        });
      } catch {
        // Non-fatal
      }

      const nowIso = new Date().toISOString();
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
        emailVerified: false,
        createdAt: nowIso,
        updatedAt: nowIso,
        lastLoginAt: nowIso,
      };

      try {
        await setDoc(doc(db, 'users', newUser.uid), newProfile, { merge: true });
      } catch {
        // Non-fatal
      }

      setUser(newUser);
      setProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      delete pendingSignUpRef.current[trimmedEmail];
      return { success: false, error: mapAuthError(err) };
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
    const demoUid = role === 'admin' ? 'servicewebsites_admin_demo' : 'servicewebsites_client_demo';
    const nowIso = new Date().toISOString();
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
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: nowIso,
    };

    try {
      const userDocRef = doc(db, 'users', demoUid);
      await setDoc(userDocRef, demoProfile, { merge: true });
    } catch {
      // Expected if Firestore rules require auth.uid == userId
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

  // Update Profile Data (Personal details & Profile picture)
  const updateProfileData = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    const activeUid = user?.uid || profile?.uid;
    if (!activeUid) {
      return { success: false, error: 'You must be logged in to update your profile.' };
    }

    if (updates.photoURL && updates.photoURL.length > 200000) {
      return {
        success: false,
        error: 'Profile image is too large after compression. Please choose a smaller image.',
      };
    }

    const nowIso = new Date().toISOString();
    const sanitizedUpdates: Partial<UserProfile> = {
      ...updates,
      updatedAt: nowIso,
    };
    // Never overwrite immutable uid or createdAt on update
    delete sanitizedUpdates.uid;
    delete sanitizedUpdates.createdAt;

    const rawProfile: UserProfile = {
      uid: activeUid,
      email: (profile?.email || user?.email || 'manager@servicewebsites.co.za').slice(0, 256),
      displayName: (sanitizedUpdates.displayName ?? profile?.displayName ?? user?.displayName ?? 'Service Websites Member').slice(0, 100),
      photoURL: sanitizedUpdates.photoURL ?? profile?.photoURL ?? user?.photoURL ?? undefined,
      role: sanitizedUpdates.role ?? profile?.role ?? 'client',
      company: (sanitizedUpdates.company ?? profile?.company ?? '').slice(0, 150),
      bio: (sanitizedUpdates.bio ?? profile?.bio ?? '').slice(0, 500),
      phone: (sanitizedUpdates.phone ?? profile?.phone ?? '').slice(0, 30),
      status: profile?.status ?? 'active',
      emailVerified: sanitizedUpdates.emailVerified ?? profile?.emailVerified ?? user?.emailVerified ?? false,
      googleVerified: sanitizedUpdates.googleVerified ?? profile?.googleVerified,
      phoneVerified: sanitizedUpdates.phoneVerified ?? profile?.phoneVerified,
      verificationCode: sanitizedUpdates.verificationCode ?? profile?.verificationCode,
      verificationCodeSentAt: sanitizedUpdates.verificationCodeSentAt ?? profile?.verificationCodeSentAt,
      verificationStatus: sanitizedUpdates.verificationStatus ?? profile?.verificationStatus,
      createdAt: profile?.createdAt || nowIso,
      updatedAt: nowIso,
      lastLoginAt: profile?.lastLoginAt || nowIso,
    };

    const nextProfile = Object.fromEntries(
      Object.entries(rawProfile).filter(([, value]) => value !== undefined)
    ) as UserProfile;

    // Update local state immediately so UI stays responsive
    setProfile(nextProfile);

    // If real Firebase authenticated user, persist to Firestore & Firebase Auth
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, nextProfile, { merge: true });

        // Firebase Auth profile photoURL only supports short HTTP(S) URLs (<2048 chars), never large data URIs
        const authPhotoUpdate =
          updates.photoURL && updates.photoURL.length < 1800 && !updates.photoURL.startsWith('data:')
            ? updates.photoURL
            : undefined;

        if (updates.displayName || authPhotoUpdate) {
          try {
            await updateAuthProfile(user, {
              displayName: nextProfile.displayName ?? user.displayName,
              ...(authPhotoUpdate ? { photoURL: authPhotoUpdate } : {}),
            });
          } catch {
            // Non-fatal Firebase Auth sync warning
          }
        }

        await logActivity({
          type: 'profile_updated',
          title: updates.photoURL ? 'Profile & Picture Updated' : 'Profile Details Updated',
          description: `${nextProfile.displayName} updated their personal profile details.`,
          actorName: nextProfile.displayName,
          actorPhoto: nextProfile.photoURL,
          targetId: user.uid,
        });

        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Failed to save profile changes to database.',
        };
      }
    }

    // Demo session local persistence
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: Boolean(user || profile),
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
