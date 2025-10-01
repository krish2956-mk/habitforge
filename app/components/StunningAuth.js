'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '../lib/storage';

export default function StunningAuth({ mode = 'signin' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store session using storage service
      StorageService.saveSession(data.user, data.token);

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main container */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {mode === 'signup' 
                ? 'Sign up and start building habits.' 
                : 'Sign in to continue'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-900/50 border border-rose-700 rounded-lg">
              <p className="text-rose-200 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Full name"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Email address"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: '#FAEAB1', color: '#1f2937' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: '#1f2937' }}></div>
                  {mode === 'signup' ? 'Creating...' : 'Signing in...'}
                </div>
              ) : (
                mode === 'signup' ? 'Continue' : 'Continue'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-600 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 px-6 bg-white hover:bg-gray-600 text-gray-900 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Continue with Google
            </button>
            
            <button
              type="button"
              className="w-full py-3 px-6 bg-white hover:bg-gray-600 text-gray-900 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Continue with Apple
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              By creating an account, you are agreeing to our{' '}
              <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
              {' '}and acknowledging receipt of our{' '}
              <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a
                href={mode === 'signup' ? '/auth/signin' : '/auth/signup'}
                className="text-indigo-400 hover:underline font-medium"
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
