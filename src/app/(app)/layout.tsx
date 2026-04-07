'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    // If not loading, user exists, but no profile, redirect to /profile
    // unless the user is already on the /profile page.
    if (!loading && !profileLoading && user && !profile && pathname !== '/profile') {
      router.replace('/profile');
    }
  }, [user, loading, profile, profileLoading, router, pathname]);

  // Allow rendering if:
  // 1. Not loading auth state
  // 2. Not loading profile state
  // 3. User exists
  // 4. Either profile exists OR we are on the /profile page (so they can create it)
  const canRender = !loading && !profileLoading && user && (profile || pathname === '/profile');

  if (!canRender) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="wavy-bg min-h-screen">
      <AppLayout>{children}</AppLayout>
    </div>
  );
}
