'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSavedJob } from '@/store/authSlice';
import Link from 'next/link';
import RouteGuard from '@/components/RouteGuard';

function formatTimeAgo(dateString: string) {
  if (!dateString) return 'Posted recently';
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
  return `${Math.floor(diffDays/30)} months ago`;
}

function getCompanyKey(job: any) {
  return job.companyId?._id || job.companyId?.companyName || job.company || null;
}

function wasPostedToday(job: any) {
  if (!job.createdAt) return false;
  const created = new Date(job.createdAt);
  const today = new Date();
  return (
    created.getFullYear() === today.getFullYear() &&
    created.getMonth() === today.getMonth() &&
    created.getDate() === today.getDate()
  );
}

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userApplications, setUserApplications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      setSearchTerm(e.detail.toLowerCase());
      setCurrentPage(1); // Reset to first page on search
    };
    window.addEventListener('jobSearch', handleSearchEvent);
    return () => window.removeEventListener('jobSearch', handleSearchEvent);
  }, []);

  const savedJobsOnly = jobs.filter(job => user?.savedJobs?.includes(job._id));

  const filteredJobs = savedJobsOnly.filter(job => 
    job.title?.toLowerCase().includes(searchTerm) || 
    (job.company || job.companyId?.companyName || '').toLowerCase().includes(searchTerm) ||
    job.companyId?.companyName?.toLowerCase().includes(searchTerm) ||
    job.tags?.some((t: string) => t.toLowerCase().includes(searchTerm))
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const companyCount = new Set(jobs.map(getCompanyKey).filter(Boolean)).size;
  const newJobsToday = jobs.filter(wasPostedToday).length;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications/developer').catch(() => ({ data: [] }))
        ]);
        setJobs(jobsRes.data);
        const appliedIds = appsRes.data.map((app: any) => app.jobId?._id || app.jobId);
        setUserApplications(appliedIds);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
                  <Link href="/applications" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black mb-2">
                    <span>My Applications</span>
                    <span className="text-accent-main">{userApplications.length}</span>
                  </Link>
                  <Link href="/saved" className="flex justify-between items-center text-xs font-bold text-black bg-gray-100 p-2 rounded -mx-2 mb-2">
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

          {/* MAIN FEED */}
          <div className="md:col-span-6 space-y-4">
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Saved Jobs</h1>
            
            {loading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse h-40" />
              ))
            ) : filteredJobs.length === 0 ? (
              <Card className="p-10 text-center text-text-muted">
                {searchTerm ? 'No saved jobs match your search.' : 'You haven\'t saved any jobs yet.'}
              </Card>
            ) : (
              <>
                {currentJobs.map(job => (
                  <Card key={job._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/jobs/${job._id}`)}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">
                      {(job.company || job.companyId?.companyName || 'C').charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-base font-bold text-black hover:underline mb-0.5">{job.title}</h2>
                        <button 
                          type="button"
                          aria-label={user?.savedJobs?.includes(job._id) ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
                          className="text-text-muted hover:text-black" 
                          onClick={async (e) => { 
                            e.stopPropagation(); 
                            if (!user) return;
                            dispatch(toggleSavedJob(job._id));
                            try {
                              await api.post(`/jobs/${job._id}/save`);
                            } catch (err) {
                              dispatch(toggleSavedJob(job._id));
                            }
                          }}
                        >
                          <Bookmark className={`h-5 w-5 ${user?.savedJobs?.includes(job._id) ? 'fill-accent-main text-accent-main' : ''}`} />
                        </button>
                      </div>
                      
                      <p className="text-sm text-text-primary mb-1">{job.company || job.companyId?.companyName || 'Unknown Company'}</p>
                      <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
                        {job.location} ({job.type})
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags?.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-0.5 rounded-full bg-accent-light text-accent-main text-[10px] font-semibold">
                            {tag}
                          </span>
                        ))}
                        {job.salary && (
                          <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent-main text-[10px] font-semibold">
                            {job.salary}
                          </span>
                        )}
                        {!job.tags && (
                          <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                            Actively Recruiting
                          </span>
                        )}
                        {userApplications.includes(job._id) && (
                          <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                            Applied
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[10px] text-text-muted">{formatTimeAgo(job.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-bg-surface p-4 rounded-xl border border-border mt-6 shadow-sm">
                  <p className="text-sm text-text-muted">
                    Showing <span className="font-bold text-black">{indexOfFirstJob + 1}</span> - <span className="font-bold text-black">{Math.min(indexOfLastJob, filteredJobs.length)}</span> of <span className="font-bold text-black">{filteredJobs.length}</span> jobs
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 rounded-md"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        if (totalPages > 7 && i !== 0 && i !== totalPages - 1 && Math.abs(i + 1 - currentPage) > 1) {
                           if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) return <span key={i} className="text-text-muted">...</span>;
                           return null;
                        }
                        return (
                          <button
                            type="button"
                            aria-label={`Go to page ${i + 1}`}
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-accent-main text-white' : 'text-text-muted hover:bg-accent-light hover:text-accent-main'}`}
                          >
                            {i + 1}
                          </button>
                        )
                      })}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 rounded-md"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="md:col-span-3 hidden md:block">
            <Card className="border-t-4 border-t-accent-main">
              <CardContent className="p-5">
                <h3 className="font-bold text-black text-base mb-4">Platform Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-accent-main">{jobs.length}</p>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Jobs Available</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-main">{companyCount}</p>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Companies Hiring</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-semibold text-success flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      {newJobsToday > 0 ? `${newJobsToday} new ${newJobsToday === 1 ? 'job' : 'jobs'} today` : 'No new jobs today'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 text-center">
              <p className="text-xs text-text-muted">HiringPlatform © 2026</p>
              <p className="text-xs text-text-muted mt-1">About • Accessibility • User Agreement</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
    </RouteGuard>
  );
}
