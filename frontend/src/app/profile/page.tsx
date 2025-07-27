'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const router = useRouter();

  const handleSave = () => {
    updateUser({ firstName, lastName, email });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold">
          {firstName?.charAt(0).toUpperCase() || 'U'}
        </div>

        <h1 className="text-2xl font-semibold mb-6">User Profile</h1>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-gray-400">Email:</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            ) : (
              <p className="mt-1">{email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-400">First Name:</label>
            {editing ? (
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            ) : (
              <p className="mt-1">{firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-400">Last Name:</label>
            {editing ? (
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            ) : (
              <p className="mt-1">{lastName}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-sm text-gray-400 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}