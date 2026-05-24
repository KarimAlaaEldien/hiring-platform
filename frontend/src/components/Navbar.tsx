'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { Button } from './ui/Button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!isInitialized) {
    return <nav className="sticky top-0 z-50 w-full bg-bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)] h-[52px]" />;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)] h-[52px]">
      <div className="container max-w-[1128px] mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl text-accent-main tracking-tight">
              HIRE/
            </span>
          </Link>
          
          <div className="hidden md:flex items-center bg-[#EEF3F8] rounded pl-3 pr-2 h-[34px] w-[280px]">
            <Search className="h-4 w-4 text-text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search by title, company, or skills" 
              onChange={(e) => {
                const term = e.target.value;
                if (window.location.pathname !== '/jobs' && term.length > 0) {
                  router.push('/jobs');
                }
                window.dispatchEvent(new CustomEvent('jobSearch', { detail: term }));
              }}
              className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex gap-6 mr-4">
                {user?.role === 'Developer' ? (
                  <>
                    <Link href="/jobs" className="text-sm text-text-muted hover:text-text-primary flex flex-col items-center">
                      <span className="font-medium">Jobs</span>
                    </Link>
                    <Link href="/applications" className="text-sm text-text-muted hover:text-text-primary flex flex-col items-center">
                      <span className="font-medium">Applications</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-primary flex flex-col items-center">
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/jobs/new" className="text-sm text-text-muted hover:text-text-primary flex flex-col items-center">
                      <span className="font-medium">Post Job</span>
                    </Link>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="h-[34px]">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="h-[40px] px-6 text-base font-semibold">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="h-[40px] px-6 text-base font-semibold">Join Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
