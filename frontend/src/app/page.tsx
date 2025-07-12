'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">Reading App</h1>
        <p className="text-xl text-gray-300 mb-8">
          Master reading comprehension with interactive passages and real-time feedback
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
