'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export const ProtectedRoute=({children}:{children:React.ReactNode})=>{const {user,loading}=useAuth();const r=useRouter();useEffect(()=>{if(!loading&&!user){r.push('/login');}},[user,loading,r]);if(loading){return(<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>);}if(!user){return null;}return <>{children}</>;}; 