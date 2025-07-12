'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-white text-3xl font-bold text-center mb-8">Sign In</h1>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white"
              disabled={loading}
            />
          </div>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-400 underline hover:text-blue-300 transition"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </button>
        </p>
      </div>
    </main>
  );
}