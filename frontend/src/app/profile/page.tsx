'use client';
import {useAuth} from '@/contexts/AuthContext';
import {useState,useEffect} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
const validateOpenAIToken=(token:string):{valid:boolean;error?:string}=>{
if(!token)return {valid:false,error:'Token is required'};
if(!token.startsWith('sk-'))return {valid:false,error:'Token must start with "sk-"'};
if(token.length<20)return {valid:false,error:'Token is too short'};
if(token.length>200)return {valid:false,error:'Token is too long'};
return {valid:true};
};
const blurToken=(token:string):string=>{
if(!token||token.length<10)return token;
const prefix=token.substring(0,12);
const suffix=token.substring(token.length-4);
const middle='*'.repeat(Math.min(8,token.length-16));
return prefix+middle+suffix;
};
export default function ProfilePage(){
const {user,updateUser}=useAuth();
const [editing,setEditing]=useState(false);
const [firstName,setFirstName]=useState(user?.firstName||'');
const [lastName,setLastName]=useState(user?.lastName||'');
const [email,setEmail]=useState(user?.email||'');
const [openaiToken,setOpenaiToken]=useState('');
const [tokenEditing,setTokenEditing]=useState(false);
const [tokenError,setTokenError]=useState('');
const [tokenSuccess,setTokenSuccess]=useState(false);
const [editingToken,setEditingToken]=useState('');
const router=useRouter();
const sp=useSearchParams();
useEffect(()=>{loadConfigs();},[]);
const loadConfigs=async()=>{try{const r=await fetch('/api/profile/configs');if(r.ok){const d=await r.json();setOpenaiToken(d.openaiToken||'');}}catch(e){console.error('Error loading configs:',e);}};
const handleSave=()=>{updateUser({firstName,lastName,email});setEditing(false);};
const handleTokenSave=async()=>{
setTokenError('');
setTokenSuccess(false);
const validation=validateOpenAIToken(editingToken);
if(!validation.valid){setTokenError(validation.error||'Invalid token format');return;}
try{const r=await fetch('/api/profile/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({openaiToken:editingToken})});if(r.ok){setOpenaiToken(editingToken);setTokenEditing(false);setTokenSuccess(true);setTimeout(()=>setTokenSuccess(false),3000);}else{const d=await r.json();setTokenError(d.error||'Failed to save token');}}catch(e){console.error('Error saving OpenAI token:',e);setTokenError('Failed to save token');}};
return(<div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md text-center"><div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold">{firstName?.charAt(0).toUpperCase()||'U'}</div><h1 className="text-2xl font-semibold mb-6">User Profile</h1><div className="space-y-4 text-left"><div><label className="block text-gray-400">Email:</label>{editing?(<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white"/>):(<p className="mt-1">{email}</p>)}</div><div><label className="block text-gray-400">First Name:</label>{editing?(<input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white"/>):(<p className="mt-1">{firstName}</p>)}</div><div><label className="block text-gray-400">Last Name:</label>{editing?(<input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white"/>):(<p className="mt-1">{lastName}</p>)}</div></div><div className="flex justify-center space-x-4 mt-6">{editing?(<><button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Save</button><button onClick={()=>setEditing(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Cancel</button></>):(<button onClick={()=>setEditing(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Edit Profile</button>)}</div><div className="mt-8 border-t border-gray-700 pt-6"><h2 className="text-xl font-semibold mb-4">LLM Token Configuration</h2><div className="space-y-4 text-left"><div><label className="block text-gray-400">OpenAI API Token:</label>{tokenEditing?(<><input type="text" value={editingToken} onChange={(e)=>{setEditingToken(e.target.value);setTokenError('');}} placeholder="sk-..." className="w-full p-2 rounded bg-gray-800 text-white"/>{tokenError&&<p className="mt-1 text-red-400 text-sm">{tokenError}</p>}</>):(<p className="mt-1 text-sm text-gray-300">{openaiToken?blurToken(openaiToken):'Not configured'}</p>)}<div className="mt-2">{tokenEditing?(<div className="flex space-x-2"><button onClick={handleTokenSave} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Save</button><button onClick={()=>{setTokenEditing(false);setTokenError('');setEditingToken('');}} className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">Cancel</button></div>):(<button onClick={()=>{setTokenEditing(true);setEditingToken(openaiToken);}} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">{openaiToken?'Edit':'Add'} Token</button>)}</div>{tokenSuccess&&<p className="mt-2 text-green-400 text-sm">Token saved successfully!</p>}</div></div></div><button onClick={()=>{const tab=sp.get('tab');router.push(tab?`/dashboard?tab=${tab}`:'/dashboard');}} className="mt-6 text-sm text-gray-400 hover:underline">← Back to Dashboard</button></div></div>);}