import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile } from '@/lib/types';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
}
