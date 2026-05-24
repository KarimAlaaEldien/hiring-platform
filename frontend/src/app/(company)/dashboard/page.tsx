'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { Briefcase, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import RouteGuard from '@/components/RouteGuard';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userStr = localStorage.getItem('token');
        if (userStr) {
          const payload = JSON.parse(atob(userStr.split('.')[1]));
          const [jobsRes, appsRes] = await Promise.all([
            api.get(`/jobs?companyId=${payload.sub}`),
            api.get('/applications/company').catch(() => ({ data: [] }))
          ]);
          setJobs(jobsRes.data);
          setApplications(appsRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'Pending').length;

  return (
    <RouteGuard allowedRoles={['Company']}>
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-[1128px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary">Company Dashboard</h1>
          <Link href="/jobs/new">
            <Button>Post New Job</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : pendingReview}</div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">My Jobs</h2>
        <div className="grid gap-4">
          {loading ? (
             <div className="animate-pulse h-24 bg-bg-surface rounded-xl"></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 text-text-muted border border-dashed border-border rounded-xl">
              No jobs posted yet.
            </div>
          ) : (
            jobs.map(job => (
              <Card key={job._id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-accent-main">{job.title}</h3>
                  <p className="text-text-muted">{job.location} • {job.type}</p>
                </div>
                <Link href={`/jobs/${job._id}/applications`}>
                  <Button variant="outline">View Applications</Button>
                </Link>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
    </RouteGuard>
  );
}
