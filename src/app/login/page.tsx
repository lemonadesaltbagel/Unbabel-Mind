'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      console.log('Login success:', res);

      // 可选：保存 token 到 localStorage（或 cookie）
      // localStorage.setItem('token', res.token);

      router.push('/dashboard'); // 登录成功跳转
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-white text-3xl font-bold text-center mb-8">Sign In</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition"
        >
          Log In
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