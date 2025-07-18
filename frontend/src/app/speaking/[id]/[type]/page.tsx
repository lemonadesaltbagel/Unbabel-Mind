'use client';
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState,useRef}from'react';
import{Home}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{Question}from'@/types/reading';
import{ld,sv,ldp,ldq,sub}from'@/utils/speaking';
import{showToast}from'@/utils/toast';
import SpeakingPrompt from'@/components/SpeakingPrompt';
import QuestionList from'@/components/QuestionList';
import ReadingControls from'@/components/ReadingControls';
import{useTestPageTitle}from'@/utils/usePageTitle';
export default function SpeakingPage(){
useTestPageTitle();
const r=useRouter();const p=useParams();const{user,loading}=useAuth();const{id,type}=p as{id:string;type:string};const pid=Number(id);const qt=Number(type);const lk=`speaking-answers-${id}-${type}`;const[pt,setPt]=useState('');const[pc,setPc]=useState('Loading speaking prompt...');const[qs,setQs]=useState<Question[]>([]);const[a,setA]=useState<Record<number,string[]>>({});const[is,setIs]=useState(false);const[recording,setRecording]=useState(false);const[audioUrl,setAudioUrl]=useState<string|null>(null);const il=useRef(true);
useEffect(()=>{if(!loading&&!user){r.push('/login');return;}},[user,loading,r]);
useEffect(()=>{setA(ld(id,type));il.current=true;},[id,type]);
useEffect(()=>{if(!il.current)sv(id,type,a);},[a,id,type]);
useEffect(()=>{(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();},[id,type]);
useEffect(()=>{(async()=>{setQs(await ldq(id,type));})();},[id,type]);
const startRecording=()=>setRecording(true);
const stopRecording=()=>{setRecording(false);setAudioUrl('recording-placeholder.mp3');};
const hsub=async()=>{if(is)return;setIs(true);const pl={passageId:pid,questionType:qt,userId:123,answers:Object.entries(a).map(([qi,ua])=>({questionId:Number(qi),userAnswer:ua}))};const{ok,message}=await sub(pl);if(ok){showToast('Submission successful!');localStorage.removeItem(lk);r.push('/dashboard');}else{showToast(message,true);}setIs(false);};
const hn=(d:'back'|'next')=>{const nt=d==='back'?qt-1:qt+1;if(nt>=1&&nt<=4)r.push(`/speaking/${id}/${nt}`);};
if(loading)return<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
if(!user)return null;
return(<div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center"><div className="w-full max-w-6xl flex justify-start mb-4"><button onClick={()=>r.push('/dashboard')}><Home className="w-6 h-6 text-white hover:text-blue-500 transition"/></button></div><div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl"><SpeakingPrompt title={pt} content={pc} recording={recording} audioUrl={audioUrl} onStartRecording={startRecording} onStopRecording={stopRecording}/><QuestionList questions={qs} answers={a} setAnswers={setA}/></div><ReadingControls questionType={qt} isSubmitting={is} onSubmit={hsub} onNavigate={hn}/></div>);} 