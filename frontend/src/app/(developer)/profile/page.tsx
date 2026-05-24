'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/store/authSlice';
import Link from 'next/link';
import RouteGuard from '@/components/RouteGuard';

export default function ProfilePage() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      title: String(form.get('title') || ''),
      company: String(form.get('company') || ''),
      bio: String(form.get('bio') || ''),
    };
    
    try {
      const res = await api.patch('/users/profile', payload);
      dispatch(setCredentials({ user: res.data, token: token! }));
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Profile updated successfully!' } }));
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: err.response?.data?.message || 'Failed to update profile' } }));
    } finally {
      setLoading(false);
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
                  <Link href="/applications" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black mb-2">
                    <span>My Applications</span>
                  </Link>
                  <Link href="/saved" className="flex justify-between items-center text-xs font-semibold text-text-muted hover:text-black mb-2">
                    <span>Saved Jobs</span>
                  </Link>
                  <Link href="/profile" className="flex justify-between items-center text-xs font-bold text-black bg-gray-100 p-2 rounded -mx-2">
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <Input 
                    label="Full Name" 
                    name="name"
                    type="text" 
                    defaultValue={user?.name || ''}
                    required 
                  />
                  <Input 
                    label="Email" 
                    name="email"
                    type="email" 
                    defaultValue={user?.email || ''}
                    required 
                  />
                  <Input 
                    label="Job Title" 
                    name="title"
                    type="text" 
                    defaultValue={user?.title || ''}
                  />
                  <Input 
                    label="Current Company" 
                    name="company"
                    type="text" 
                    defaultValue={user?.company || ''}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="profile-bio" className="text-sm font-medium text-text-primary">Bio</label>
                    <textarea 
                      id="profile-bio"
                      name="bio"
                      className="flex min-h-[120px] w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main transition-all"
                      placeholder="Tell us about yourself..."
                      maxLength={300}
                      defaultValue={user?.bio || ''}
                    />
                    <span className="text-xs text-text-muted self-end">300 characters max</span>
                  </div>
                  <Button type="submit" isLoading={loading} className="w-full mt-4">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* RIGHT SIDEBAR */}
          <div className="md:col-span-3 hidden md:block">
            <Card className="border-t-4 border-t-accent-main">
              <CardContent className="p-5">
                <h3 className="font-bold text-black text-base mb-2">Profile Tips</h3>
                <p className="text-sm text-text-muted mb-4">A complete profile increases your chances of getting noticed by companies.</p>
                <ul className="text-sm text-text-muted space-y-2 list-disc pl-4">
                  <li>Use a clear, professional job title.</li>
                  <li>Write a short and engaging bio.</li>
                  <li>Keep your email up to date.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
    </RouteGuard>
  );
}
