'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { RootState } from '@/store';
import { MapPin, Briefcase, Building, ArrowLeft, Users, DollarSign } from 'lucide-react';

const JobDescriptionRender = ({ description }: { description: string }) => {
  return (
    <div className="space-y-2 mt-4">
      {description.split('\n').map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-black mt-8 mb-4 border-b border-border pb-2">{line.replace('### ', '')}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={i} className="text-text-primary ml-6 mb-1.5 list-disc">{line.replace('- ', '')}</li>;
        } else if (line.trim() === '') {
          return null;
        } else {
          return <p key={i} className="text-text-primary leading-relaxed text-sm">{line}</p>;
        }
      })}
    </div>
  );
};

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndApps = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${params.id}`),
          api.get('/applications/developer').catch(() => ({ data: [] }))
        ]);
        setJob(jobRes.data);
        const applied = appsRes.data.some((app: any) => app.jobId?._id === params.id || app.jobId === params.id);
        setHasApplied(applied);
        if (applied) {
          setMessage('You have already applied for this job');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApps();
  }, [params.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setApplying(true);
    setMessage('');
    try {
      await api.post('/applications', {
        jobId: params.id,
        resumeUrl,
        coverLetter
      });
      setMessage('Application submitted successfully!');
      setHasApplied(true);
      setTimeout(() => router.push('/applications'), 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error submitting application';
      setMessage(errorMsg);
      if (errorMsg.includes('already applied')) {
        setHasApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-primary pt-20 text-center">Loading...</div>;
  if (!job) return <div className="min-h-screen bg-bg-primary pt-20 text-center">Job not found</div>;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-bg-surface p-6 rounded-xl border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-500">
                  {(job.company || job.companyId?.companyName || 'C').charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-heading font-bold text-black mb-1">{job.title}</h1>
                  <p className="text-lg text-accent-main font-semibold">{job.companyId?.companyName || job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-text-muted mt-6 pb-6 border-b border-border">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {job.type}</span>
                {job.salary && <span className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {job.salary}</span>}
                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {job.applicants || 0} applicants</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {job.tags?.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-accent-light text-accent-main text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-bg-surface p-6 rounded-xl border border-border">
              <JobDescriptionRender description={job.description} />
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-text-muted">Sign in as a developer to apply for this job.</p>
                    <Link href="/login">
                      <Button className="w-full">Sign In to Apply</Button>
                    </Link>
                  </div>
                ) : user.role !== 'Developer' ? (
                  <p className="text-sm text-text-muted">Only developer accounts can apply for jobs.</p>
                ) : (
                <form onSubmit={handleApply} className="flex flex-col gap-4">
                  {message && (
                    <div className={`p-3 rounded text-sm text-center ${message.includes('success') ? 'bg-green-500/10 text-green-500 border border-green-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>
                      {message}
                    </div>
                  )}
                  <Input 
                    label="Resume URL" 
                    placeholder="Link to your resume/portfolio" 
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    required 
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cover-letter" className="text-sm font-medium text-text-primary">Cover Letter (Optional)</label>
                    <textarea 
                      id="cover-letter"
                      className="flex min-h-[120px] w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main transition-all disabled:opacity-50"
                      placeholder="Why are you a good fit?"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={hasApplied}
                    />
                  </div>
                  <Button type="submit" isLoading={applying} className="w-full" disabled={hasApplied}>
                    {hasApplied ? 'Applied' : 'Submit Application'}
                  </Button>
                </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
