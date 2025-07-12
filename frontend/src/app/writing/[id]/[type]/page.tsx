'use client';
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState}from'react';
import{Home}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{ldp,sub,wc}from'@/utils/writing';
import{showToast}from'@/utils/toast';
import WritingPrompt from'@/components/WritingPrompt';
import EssayEditor from'@/components/EssayEditor';
import ReadingControls from'@/components/ReadingControls';
import{useTestPageTitle}from'@/utils/usePageTitle';
export default function WritingPage(){
useTestPageTitle();
const r=useRouter();const p=useParams();const{user,loading}=useAuth();const{id,type}=p as{id:string;type:string};const pid=Number(id);const qt=Number(type);const lk=`writing-answers-${id}-${type}`;const[pt,setPt]=useState('');const[pc,setPc]=useState('Loading writing prompt...');const[is,setIs]=useState(false);const[essay,setEssay]=useState('');
useEffect(()=>{if(!loading&&!user){r.push('/login');return;}},[user,loading,r]);
useEffect(()=>{(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();},[id,type]);
const hsub=async()=>{if(is)return;setIs(true);const pl={passageId:pid,questionType:qt,userId:123,essay};const{ok,message}=await sub(pl);if(ok){showToast('Submission successful!');localStorage.removeItem(lk);r.push('/dashboard');}else{showToast(message,true);}setIs(false);};
const hn=(d:'back'|'next')=>{const nt=d==='back'?qt-1:qt+1;if(nt>=1&&nt<=4)r.push(`/writing/${id}/${nt}`);};
if(loading)return<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
if(!user)return null;
return(<div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center"><div className="w-full max-w-6xl flex justify-start mb-4"><button onClick={()=>r.push('/dashboard')}><Home className="w-6 h-6 text-white hover:text-blue-500 transition"/></button></div><div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl"><WritingPrompt title={pt} content={pc} wordCount={wc(essay)}/><EssayEditor essay={essay} setEssay={setEssay}/></div><ReadingControls questionType={qt} isSubmitting={is} onSubmit={hsub} onNavigate={hn}/></div>);} 