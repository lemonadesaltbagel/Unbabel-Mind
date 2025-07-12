'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut } from 'lucide-react';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const activeTab = 'Reading'; // 固定显示 Reading

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="ml-16 flex-1 p-6 overflow-y-auto">
          {/* Tab Header */}
          <div className="flex space-x-6 border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 text-lg ${
                  activeTab === tab
                    ? 'border-b-2 border-white font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* IELTS Cambridge Sets */}
          {Array.from({ length: 20 }, (_, index) => {
            const cambridgeNumber = 20 - index; // 从 20 倒序到 1
            const startId = index * 4 + 1;
            return (
              <div key={index} className="mb-8">
                <h2 className="text-white text-xl font-semibold mb-4">
                  IELTS Cambridge {cambridgeNumber}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }, (_, i) => {
                    const id = startId + i;
                    return (
                      <div
                        key={id}
                        onClick={() => router.push(`/passage/${id}/1`)}
                        className="border border-gray-600 bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
                      >
                        <div className="text-white text-lg font-medium mb-2">
                          Test {i + 1}
                        </div>
                        <div className="text-gray-400 text-sm">Click to Start</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </ProtectedRoute>
  );
}