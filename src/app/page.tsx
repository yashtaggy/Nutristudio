'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import LoadingSpinner from '@/components/shared/loading-spinner';

export default function HomePage() {
  const { user, loading, profile, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profileLoading) {
      if (user) {
        if (profile) {
          router.replace('/dashboard');
        } else {
          router.replace('/profile');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, profile, profileLoading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <LoadingSpinner className="h-12 w-12 text-primary" />
      <p className="text-muted-foreground">Initializing NutriNudge...</p>
    </div>
  );
}
