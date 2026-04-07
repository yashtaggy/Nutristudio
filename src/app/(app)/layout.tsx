'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import AppLayout from '@/components/layout/app-layout';
import LoadingSpinner from '@/components/shared/loading-spinner';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, profile, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!profileLoading && user && !profile) {
      router.replace('/profile');
    }
  }, [user, loading, profile, profileLoading, router]);

  if (loading || profileLoading || !user || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
