'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // 这里可以调用 registerUser 函数，例如 post 到 /api/auth/register
    alert(`Registered:\n${firstName} ${lastName}\n${email}`);
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-white text-3xl font-bold text-center mb-8">Sign Up</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-6 bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition"
        >
          Register
        </button>
      </div>
    </main>
  );
}