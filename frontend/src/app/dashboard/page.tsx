// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { passageAPI } from '@/utils/api';
import type { Passage } from '@/types';
const tabs = ['Reading', 'Listening', 'Speaking', 'Writing'];
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Reading');
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();
  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const data = await passageAPI.getAll();
        setPassages(data);
      } catch (error) {
        console.error('Failed to fetch passages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPassages();
  }, []);
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex">
        <aside className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-6">
          <button onClick={() => router.push('/dashboard')} className="mb-6">
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="mt-auto mb-4 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <span className="text-xs mt-1 text-white">Profile</span>
            <button onClick={handleLogout} className="mt-2">
              <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </aside>
        <main className="ml-16 flex-1 p-6 overflow-y-auto">
          <div className="flex space-x-6 border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-lg ${
                  activeTab === tab
                    ? 'border-b-2 border-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading passages...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {passages.map((passage) => (
                <div
                  key={passage.id}
                  onClick={() => router.push(`/passage/${passage.id}`)}
                  className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg">{passage.title}</span>
                    {passage.completed && (
                      <span className="text-green-400 text-sm">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}