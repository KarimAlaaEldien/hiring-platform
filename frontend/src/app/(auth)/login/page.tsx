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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const profileResponse = await api.get('/users/profile');
      const userProfile = profileResponse.data;
      
      dispatch(setCredentials({ user: userProfile, token: accessToken }));
      
      if (userProfile.role === 'Company') {
        router.push('/dashboard');
      } else {
        router.push('/jobs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-main/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Link href="/" className="flex items-center gap-2 mb-8 z-10">
        <Briefcase className="h-8 w-8 text-accent-main" />
        <span className="font-heading text-3xl font-bold tracking-tight">HiringPlatform</span>
      </Link>

      <Card className="w-full max-w-md z-10">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <p className="text-text-muted mt-2">Log in to access your dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">{error}</div>}
            
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
            
            <Button type="submit" className="w-full mt-4" isLoading={loading}>
              Sign In
            </Button>
            
            <p className="text-center text-sm text-text-muted mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-accent-main hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
