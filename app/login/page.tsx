'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Email and password are required');
      setStatus('error');
      return;
    }
    
    try {
      setStatus('loading');
      
      let error = null;
      
      if (isSignUp) {
        const { error: signUpError } = await authService.signUp(email, password);
        error = signUpError;
      } else {
        const { error: signInError } = await authService.signInWithPassword(email, password);
        error = signInError;
      }
      
      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
      } else {
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
    }
  };

  const handleGoogleLogin = async () => {
    setStatus('loading');
    const { error } = await authService.signInWithGoogle();
    
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6">
          <span className="text-neutral-950 font-bold text-xl">O</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
        <p className="text-sm text-neutral-400 mt-2">{isSignUp ? 'Get started with Orbital' : 'Sign in to your Orbital workspace'}</p>
      </div>

      <Card className="p-6">
        {status === 'success' ? (
          <div className="text-center py-4">
            <h3 className="text-emerald-400 font-medium mb-2">Check your email</h3>
            <p className="text-sm text-neutral-400">
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === 'loading'}
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-neutral-900/40 px-2 text-neutral-500">Or</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={status === 'loading'}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {status === 'error' && (
              <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            
            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setStatus('idle');
                  setErrorMessage('');
                }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </>
        )}
      </Card>
      
      <p className="text-center text-xs text-neutral-500">
        By continuing, you agree to Orbital's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
