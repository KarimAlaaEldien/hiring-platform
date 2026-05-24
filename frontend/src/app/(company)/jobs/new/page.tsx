'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import RouteGuard from '@/components/RouteGuard';

export default function NewJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', { title, description, location, type });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRoles={['Company']}>
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input 
                label="Job Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="job-description" className="text-sm font-medium text-text-primary">Description</label>
                <textarea 
                  id="job-description"
                  className="flex min-h-[150px] w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main transition-all"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Location" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  required 
                />
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-type" className="text-sm font-medium text-text-primary">Job Type</label>
                  <select 
                    id="job-type"
                    className="flex h-10 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main transition-all"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={loading}>Post Job</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
    </RouteGuard>
  );
}
