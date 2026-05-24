'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';
import { setCredentials } from '@/store/authSlice';
import { Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Developer' | 'Company'>('Developer');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { 
        name, 
        email, 
        password, 
        role, 
        companyName: role === 'Company' ? companyName : undefined,
        title: role === 'Developer' ? title : undefined,
        company: role === 'Developer' ? company : undefined
      };
      const response = await api.post('/auth/register', payload);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      dispatch(setCredentials({ user, token: accessToken }));
      
      if (user.role === 'Company') {
        router.push('/dashboard');
      } else {
        router.push('/jobs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-warm/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Link href="/" className="flex items-center gap-2 mb-8 z-10">
        <Briefcase className="h-8 w-8 text-accent-warm" />
        <span className="font-heading text-3xl font-bold tracking-tight">HiringPlatform</span>
      </Link>

      <Card className="w-full max-w-md z-10">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <p className="text-text-muted mt-2">Join as a Developer or Company</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">{error}</div>}
            
            <div className="grid grid-cols-2 gap-2 mb-2 p-1 bg-bg-secondary rounded-lg">
              <button
                type="button"
                onClick={() => setRole('Developer')}
                className={`py-2 rounded-md text-sm font-medium transition-all ${role === 'Developer' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                Developer
              </button>
              <button
                type="button"
                onClick={() => setRole('Company')}
                className={`py-2 rounded-md text-sm font-medium transition-all ${role === 'Company' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                Company
              </button>
            </div>

            <Input 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            
            {role === 'Developer' && (
              <>
                <Input 
                  label="Job Title (e.g. Frontend Developer)" 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                />
                <Input 
                  label="Current Company (Optional, e.g. Freelance)" 
                  type="text" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                />
              </>
            )}
            
            {role === 'Company' && (
              <Input 
                label="Company Name" 
                type="text" 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                required 
              />
            )}
            
            <Button type="submit" className="w-full mt-4" isLoading={loading}>
              Sign Up
            </Button>
            
            <p className="text-center text-sm text-text-muted mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-main hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
