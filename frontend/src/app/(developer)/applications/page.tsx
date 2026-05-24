'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';
import RouteGuard from '@/components/RouteGuard';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications/developer');
        setApplications(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-accent-warm" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'text-green-500 bg-green-500/10 border-green-500/50';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/50';
      default: return 'text-accent-warm bg-accent-warm/10 border-accent-warm/50';
    }
  };

  return (
    <RouteGuard allowedRoles={['Developer']}>
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="container max-w-[1128px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="md:col-span-3 hidden md:block">
            <Card className="overflow-hidden">
              <div className="h-16 bg-gray-300 w-full" />
              <CardContent className="p-4 flex flex-col items-center -mt-10">
                <div className="w-16 h-16 bg-white rounded-full border-2 border-white mb-2 overflow-hidden flex items-center justify-center shadow-sm">
                  <div className="w-full h-full bg-accent-light text-accent-main flex items-center justify-center text-xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <h3 className="font-bold text-black text-center">{user?.name || 'User'}</h3>
                <p className="text-xs text-text-muted text-center mb-4">{user?.title || user?.role || 'Developer'} at {user?.company || user?.companyName || 'Open to work'}</p>
                
                <div className="w-full border-t border-border pt-4 mt-2">
                  <Link href="/jobs" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black mb-2">
                    <span>Job Feed</span>
                  </Link>
                  <Link href="/applications" className="flex justify-between items-center text-xs font-bold text-black bg-gray-100 p-2 rounded -mx-2 mb-2">
                    <span>My Applications</span>
                    <span className="text-accent-main">{applications.length}</span>
                  </Link>
                  <Link href="/saved" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black mb-2">
                    <span>Saved Jobs</span>
                    <span className="text-accent-main">{user?.savedJobs?.length || 0}</span>
                  </Link>
                  <Link href="/profile" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black">
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-6 space-y-4">
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">My Applications</h1>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-24" />)}
              </div>
            ) : applications.length === 0 ? (
              <Card className="text-center py-20 text-text-muted">
                <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>You haven&apos;t applied to any jobs yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map(app => (
                  <Card key={app._id} className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-black">{app.jobId?.title}</h3>
                      <p className="text-sm text-text-primary mt-1">{app.jobId?.company || app.jobId?.companyId?.companyName || 'Unknown Company'} • {app.jobId?.location}</p>
                      <span className="text-xs text-text-muted mt-2">Applied {app.createdAt ? formatDistanceToNow(new Date(app.createdAt)) : 'recently'} ago</span>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-sm font-medium ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="md:col-span-3 hidden md:block">
            <Card className="border-t-4 border-t-accent-main">
              <CardContent className="p-5">
                <h3 className="font-bold text-black text-base mb-4">Application Tips</h3>
                <div className="space-y-4 text-sm text-text-muted">
                  <p>Follow up on applications after a week if you don&apos;t hear back.</p>
                  <p>Keep your profile updated with your latest projects and skills.</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
    </RouteGuard>
  );
}
