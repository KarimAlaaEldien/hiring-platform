'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { ArrowLeft, FileText, Mail, User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import RouteGuard from '@/components/RouteGuard';

export default function JobApplicationsPage() {
  const params = useParams();
  const id = params.id as string;
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchApps = async () => {
      try {
        const res = await api.get(`/applications/job/${id}`);
        setApplications(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [id]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RouteGuard allowedRoles={['Company']}>
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-8">Job Applications</h1>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2].map(i => <Card key={i} className="animate-pulse h-40" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No applications received yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => (
              <Card key={app._id}>
                <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-accent-main flex items-center gap-2">
                          <User className="h-5 w-5" /> {app.developerId?.name}
                        </h3>
                        <p className="text-text-muted flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" /> {app.developerId?.email}
                        </p>
                      </div>
                      <span className="text-sm text-text-muted">
                        Applied {formatDistanceToNow(new Date(app.createdAt))} ago
                      </span>
                    </div>

                    <div className="p-4 bg-bg-secondary rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Cover Letter
                      </h4>
                      <p className="text-sm text-text-muted whitespace-pre-wrap">{app.coverLetter || 'No cover letter provided.'}</p>
                    </div>

                    <div>
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-accent-main hover:underline text-sm font-medium">
                        View Resume &rarr;
                      </a>
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-sm font-medium mb-2">Current Status: <span className="text-white">{app.status}</span></div>
                    {app.status === 'Pending' ? (
                      <>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(app._id, 'Accepted')}>
                          Accept Candidate
                        </Button>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => updateStatus(app._id, 'Rejected')}>
                          Reject Candidate
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => updateStatus(app._id, 'Pending')}>
                        Mark as Pending
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
    </RouteGuard>
  );
}

// Icon component missing from import above
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
