'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePageTitle } from '@/utils/usePageTitle';
const t=['Reading','Listening','Speaking','Writing'];
export default function DashboardPage(){
usePageTitle('Unbebel Language');
const r=useRouter();
const sp=useSearchParams();
const {user,logout}=useAuth();
const [a,sa]=useState('Reading');
const hl=()=>{logout();r.push('/login');};
const htc=(tab:string)=>{sa(tab);};
useEffect(()=>{const tab=sp.get('tab');if(tab&&t.includes(tab))sa(tab);},[sp]);
return(<ProtectedRoute><div className="min-h-screen bg-black text-white flex"><aside className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-6"><button onClick={()=>r.push('/dashboard')} className="mb-6"><Home className="w-6 h-6 text-white"/></button><div className="mt-auto mb-4 flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">{user?.firstName?.charAt(0)||'U'}</div><span className="text-xs mt-1 text-white">Profile</span><button onClick={hl} className="mt-2"><LogOut className="w-4 h-4 text-gray-400 hover:text-white"/></button></div></aside><main className="ml-16 flex-1 p-6 overflow-y-auto relative"><div className="absolute top-0 right-0 p-4"><button onClick={hl} className="text-sm text-white border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 transition">Logout</button></div><div className="flex space-x-6 border-b border-gray-700 mb-6">{t.map((tab)=>(<button key={tab} onClick={()=>htc(tab)} className={`pb-2 text-lg ${a===tab?'border-b-2 border-white font-semibold':'text-gray-400'}`}>{tab}</button>))}</div>{Array.from({length:20},(_,i)=>{const cs=20-i;return(<div key={i} className="mb-8"><h2 className="text-white text-xl font-semibold mb-4">IELTS Cambridge {cs}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:4},(_,j)=>{const tn=j+1;return(<div key={tn} onClick={()=>r.push(`/${a.toLowerCase()}/${cs}/${tn}`)} className="border border-gray-600 bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"><div className="text-white text-lg font-medium mb-2">Test {tn}</div><div className="text-gray-400 text-sm">Click to Start</div></div>);})}</div></div>);})}</main></div></ProtectedRoute>);}