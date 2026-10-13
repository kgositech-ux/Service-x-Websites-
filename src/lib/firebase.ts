import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// CRITICAL: getFirestore must use the explicit database ID if present
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

// Clean Google Auth Provider for standard app sign-in (NO sensitive Drive scopes)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Dedicated Google Drive Auth Provider with Drive file scope used ONLY for Drive integration
export const googleDriveProvider = new GoogleAuthProvider();
googleDriveProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleDriveProvider.setCustomParameters({
  prompt: 'select_account',
});

// Cache OAuth access token in memory (never localStorage)
let cachedDriveAccessToken: string | null = null;

export const setCachedDriveAccessToken = (token: string | null) => {
  cachedDriveAccessToken = token;
};

export const getCachedDriveAccessToken = (): string | null => {
  return cachedDriveAccessToken;
};

// Test connection silently if needed
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch {
    // Non-fatal check
  }
}

// Structured Firestore error handling conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Sign-In with Google Popup (Clean standard sign-in for users)
export async function signInWithGoogle(): Promise<{
  user: FirebaseUser;
  accessToken: string | null;
} | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    return { user: result.user, accessToken };
  } catch (error: any) {
    const errorCode = error?.code || '';
    // Gracefully handle user closing popup, request cancellation, or iframe blocker
    if (
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/popup-blocked' ||
      (typeof error?.message === 'string' && error.message.includes('popup-closed-by-user'))
    ) {
      return null;
    }
    console.warn('Google sign-in notice:', error?.message || error);
    throw error;
  }
}

// Sign-In with Google for Drive (Specifically requests drive.file scope when syncing to Google Drive)
export async function signInWithGoogleForDrive(): Promise<{
  user: FirebaseUser;
  accessToken: string | null;
} | null> {
  try {
    const result = await signInWithPopup(auth, googleDriveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    if (accessToken) {
      setCachedDriveAccessToken(accessToken);
    }
    return { user: result.user, accessToken };
  } catch (error: any) {
    const errorCode = error?.code || '';
    if (
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/popup-blocked' ||
      (typeof error?.message === 'string' && error.message.includes('popup-closed-by-user'))
    ) {
      return null;
    }
    console.warn('Google Drive sign-in notice:', error?.message || error);
    throw error;
  }
}

// Sign-Out
export async function logOut(): Promise<void> {
  setCachedDriveAccessToken(null);
  await signOut(auth);
}
