import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-closed-by-user'
    ) {
      console.warn('Google sign-in popup was closed or cancelled by user.');
      return null;
    }
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { onAuthStateChanged };
export type { User };

// Firestore CRUD Helpers
export const syncUserProfile = async (user: User) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const newProfile = {
      name: user.displayName || 'Bailleur',
      email: user.email || '',
      companyName: 'ImmoGestion SCI',
      phone: user.phoneNumber || '+33 6 12 34 56 78',
      address: '12 Avenue des Champs-Élysées, 75008 Paris',
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
  return snap.data();
};

export const fetchUserData = async <T>(collectionName: string, userId: string): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const results: T[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  } catch (err) {
    console.error(`Error fetching ${collectionName}:`, err);
    return [];
  }
};

export const saveUserDoc = async (collectionName: string, docId: string, data: any, userId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, userId }, { merge: true });
  } catch (err) {
    console.error(`Error saving to ${collectionName}:`, err);
  }
};

export const deleteUserDoc = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting doc from ${collectionName}:`, err);
  }
};
