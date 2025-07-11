// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing'];
const sections = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25'
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Reading');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - fixed */}
      <aside className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-6">
        <button onClick={() => router.push('/dashboard')} className="mb-6">
          <Home className="w-6 h-6 text-white" />
        </button>

        <div className="mt-auto mb-4 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            N {/* <-- Name First initial (后端替换) */}
          </div>
          <span className="text-xs mt-1 text-white">Profile</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-16 flex-1 p-6 overflow-y-auto">
        {/* Tabs */}
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

        {/* Section Cards with Clickable Links */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => router.push(`/passage/${section}`)}
              className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer"
            >
              <span className="text-white text-lg">{section}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}