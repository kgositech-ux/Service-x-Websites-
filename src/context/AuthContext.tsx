import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateProfileData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

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
                email: firebaseUser.email || 'user@service4websites.com',
                displayName: firebaseUser.displayName || 'Service4Websites Member',
                photoURL:
                  firebaseUser.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
                role: firebaseUser.email === 'servicewebsites6@gmail.com' ? 'admin' : 'client',
                company: 'Service4Websites Partner',
                bio: 'Passionate about high-performing web experiences and digital growth.',
                phone: '+1 (555) 234-5678',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              };

              try {
                await setDoc(userDocRef, newProfile);
                setProfile(newProfile);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
              }
            }
            setLoading(false);
          },
          (err) => {
            handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
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

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Failed to sign in:', err);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await logOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updatedPayload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(userDocRef, updatedPayload);

      // If photoURL or displayName changed, also update Firebase Auth user profile object
      if (updates.displayName || updates.photoURL) {
        await updateAuthProfile(user, {
          displayName: updates.displayName ?? user.displayName,
          photoURL: updates.photoURL ?? user.photoURL,
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signOut: signOutUser,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
