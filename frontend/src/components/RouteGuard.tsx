'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function RouteGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useSelector((state: RootState) => state.auth);
  const isAllowed = !allowedRoles || (user?.role && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!isAllowed) {
      router.replace(user?.role === 'Company' ? '/dashboard' : '/jobs');
    }
  }, [isAllowed, isAuthenticated, isInitialized, router, user?.role]);

  if (!isInitialized || !isAuthenticated || !isAllowed) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 text-center text-text-muted">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
