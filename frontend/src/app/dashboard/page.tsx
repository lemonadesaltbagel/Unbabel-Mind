'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Reading');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex">
        {/* 左侧栏 */}
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

        {/* 主区域 */}
        <main className="ml-16 flex-1 p-6 overflow-y-auto relative">
          {/* 右上角 Logout 按钮 */}
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={handleLogout}
              className="text-sm text-white border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>

          {/* 顶部 tab 切换 */}
          <div className="flex space-x-6 border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
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

          {/* 每个套题 */}
          {Array.from({ length: 20 }, (_, i) => {
            const cambridgeSet = 20 - i;
            return (
              <div key={i} className="mb-8">
                <h2 className="text-white text-xl font-semibold mb-4">
                  IELTS Cambridge {cambridgeSet}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }, (_, j) => {
                    const testNum = j + 1;
                    return (
                      <div
                        key={testNum}
                        onClick={() =>
                          router.push(
                            `/${activeTab.toLowerCase()}/${cambridgeSet}/${testNum}`
                          )
                        }
                        className="border border-gray-600 bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
                      >
                        <div className="text-white text-lg font-medium mb-2">
                          Test {testNum}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Click to Start
                        </div>
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