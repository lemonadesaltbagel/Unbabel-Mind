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
import CopyrightMessage from'@/components/CopyrightMessage';
import{useTestPageTitle}from'@/utils/usePageTitle';
import{useTimer}from'@/utils/useTimer';
export default function WritingPage(){
useTestPageTitle();
const r=useRouter();const p=useParams();const{user,loading}=useAuth();const{id,type}=p as{id:string;type:string};const pid=Number(id);const qt=Number(type);const lk=`writing-answers-${id}-${type}`;const[pt,setPt]=useState('');const[pc,setPc]=useState('Loading writing prompt...');const[is,setIs]=useState(false);const[essay,setEssay]=useState('');const[showConfirm,setShowConfirm]=useState(false);const{tm}=useTimer();
useEffect(()=>{
if(!loading&&!user)r.push('/login');
},[user,loading,r]);
useEffect(()=>{(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();},[id,type]);
useEffect(()=>{const saved=localStorage.getItem(lk);if(saved)setEssay(saved);},[lk]);
useEffect(()=>{localStorage.setItem(lk,essay);},[lk,essay]);
const hsub=async()=>{
if(is)return;
const trimmedEssay=essay.trim();
if(!trimmedEssay){
setShowConfirm(true);
return;
}
setIs(true);
const pl={passageId:pid,questionType:qt,userId:Number(user?.id),essay:trimmedEssay};
const {ok,message}=await sub(pl);
if(ok){
showToast('Submission successful!');
localStorage.removeItem(lk);
r.push(`/writing/${id}/${type}/review`);
}else{
showToast(message,true);
}
setIs(false);
};
const confirmEmpty=async()=>{
setShowConfirm(false);
setIs(true);
const pl={passageId:pid,questionType:qt,userId:Number(user?.id),essay:''};
const {ok,message}=await sub(pl);
if(ok){
showToast('Empty submission confirmed and submitted!');
localStorage.removeItem(lk);
r.push(`/writing/${id}/${type}/review`);
}else{
showToast(message,true);
}
setIs(false);
};
const hn=(d:'back'|'next')=>{
if(d==='back'){
r.push('/dashboard?tab=Writing');
}else{
const nt=qt+1;
if(nt>=1&&nt<=4)r.push(`/writing/${id}/${nt}`);
}
};
if(loading)return(<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>);
if(!user)return null;
const isContentMissing=pt===''||pc==='Failed to load writing prompt.';
if(isContentMissing)return<CopyrightMessage quizType="writing" quizId={id} questionType={type}/>;
return(<div className="min-h-screen bg-black text-black p-6 flex flex-col items-center">
{showConfirm&&(<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white p-6 rounded-lg max-w-md mx-4">
<h3 className="text-lg font-semibold mb-4">Confirm Empty Submission</h3>
<p className="text-gray-600 mb-6">You are about to submit an empty essay. Are you sure you want to continue?</p>
<div className="flex space-x-3">
<button onClick={()=>setShowConfirm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
<button onClick={confirmEmpty} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Submit Empty</button>
</div>
</div>
</div>)}
<div className="w-full max-w-full flex justify-between items-center mb-4"><button onClick={()=>r.push('/dashboard?tab=Writing')}><Home className="w-6 h-6 text-white hover:text-blue-500 transition"/></button><div className="text-white text-xl font-mono">{tm}</div><div></div></div><div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full max-w-full"><WritingPrompt title={pt} content={pc} wordCount={wc(essay)}/><EssayEditor essay={essay} setEssay={setEssay}/></div><ReadingControls questionType={qt} isSubmitting={is} onSubmit={hsub} onNavigate={hn}/></div>);
}