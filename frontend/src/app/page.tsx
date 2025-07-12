'use client';
import {useState,useEffect} from 'react';
export default function Home(){
const [apiStatus,setApiStatus]=useState<string>('');
const [loading,setLoading]=useState(false);
const testAPI=async()=>{
setLoading(true);
try{
const response=await fetch('http://localhost:3001/api/health');
const data=await response.json();
setApiStatus(`API Status: ${data.status} at ${data.timestamp}`);
}catch{
setApiStatus('API Error: Backend not running');
}finally{
setLoading(false);
}
};
useEffect(()=>{testAPI();},[]);
return(
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
<div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hackathon Project</h1>
<div className="space-y-4">
<div className="p-4 bg-gray-50 rounded-lg">
<p className="text-sm text-gray-600 mb-2">Backend Status:</p>
<p className="text-sm font-mono">{apiStatus||'Checking...'}</p>
</div>
<button onClick={testAPI} disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
{loading?'Testing...':'Test API Connection'}
</button>
<div className="text-center text-sm text-gray-500 mt-4">
<p>Frontend: Next.js + TypeScript + Tailwind</p>
<p>Backend: Node.js + Express + PostgreSQL</p>
</div>
</div>
</div>
</div>
);
}
