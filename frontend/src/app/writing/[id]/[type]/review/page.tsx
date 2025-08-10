'use client';
import {useParams,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {Home} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext';
import {ldp} from '@/utils/writing';
import {useTestPageTitle} from '@/utils/usePageTitle';
import {checkTokenAndWarn} from '@/utils/tokenCheck';
export default function WritingReviewPage(){
useTestPageTitle();
const {id,type}=useParams() as {id:string;type:string};
const r=useRouter();
const {user,loading}=useAuth();
const [t,setT]=useState('');
const [c,setC]=useState('');
const [e,setE]=useState('');
const [a,setA]=useState('');
const [i,setI]=useState(false);
useEffect(()=>{if(!loading&&!user)r.push('/login');},[loading,user,r]);
useEffect(()=>{(async()=>{const {title,content}=await ldp(id,type);setT(title);setC(content);})();
const s=localStorage.getItem(`writing-answers-${id}-${type}`);
if(s)setE(s);},[id,type]);
useEffect(()=>{if(!e)return;setI(true);
const p=`You are an IELTS writing expert. Please review the following essay:\n\n"${e}"\n\nGive specific suggestions to improve it in terms of grammar, structure, coherence, and task response. Reply with bullet points.`;
checkTokenAndWarn().then(hasToken=>{if(hasToken){fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}).then(res=>res.json()).then(data=>{setA(data.generated_text||'No response.');setI(false);}).catch(()=>{setA('Error fetching suggestions.');setI(false);});}else{setA('Please configure your OpenAI API token in your profile to use AI features.');setI(false);}});},[e]);
if(loading)return <div className="text-white">Loading...</div>;
if(!user)return null;
return(<div className="min-h-screen bg-black text-white p-4"><div className="mb-2"><Home className="w-6 h-6 cursor-pointer hover:text-gray-300" onClick={()=>r.push('/dashboard')}/></div><div className="flex max-w-7xl w-full space-x-4 mt-6 mx-auto"><div className="basis-[35%] bg-white text-black p-6 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow overflow-y-auto h-[80vh]"><h2 className="text-xl font-bold mb-4">Writing Prompt</h2><h3 className="text-lg font-semibold mb-2">{t}</h3><div className="text-sm whitespace-pre-wrap">{c}</div></div><div className="basis-[35%] bg-white text-black p-6 rounded-xl shadow overflow-y-auto h-[80vh]"><h2 className="text-xl font-bold mb-4">Your Essay</h2><div className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{e}</div></div><div className="basis-[30%] bg-white text-black p-6 rounded-xl shadow overflow-y-auto h-[80vh]"><button className="w-full py-2 bg-gray-100 text-gray-800 rounded font-semibold text-center mb-4">Unbabel</button><p className="text-center text-sm text-gray-500 mb-6">Get Started with Unbabel for IELTS</p>{i?<div className="text-gray-500">Generating...</div>:<div className="text-sm whitespace-pre-wrap">{a}</div>}</div></div></div>);}