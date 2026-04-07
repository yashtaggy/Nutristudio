'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/firestore';
import type { AuthContextType, UserProfile } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async (firebaseUser: User | null) => {
    setProfileLoading(true);
    if (firebaseUser) {
      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      fetchProfile(firebaseUser);
    });

    return () => unsubscribe();
  }, [fetchProfile]);
  
  const refetchProfile = useCallback(() => {
      if(user) fetchProfile(user);
  }, [user, fetchProfile])

  const value = { user, profile, loading, profileLoading, refetchProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
