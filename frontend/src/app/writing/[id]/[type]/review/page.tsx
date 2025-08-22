'use client';
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState,useCallback}from'react';
import{Home,RefreshCw}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{ldp,getWritingRating}from'@/utils/writing';
import{useTestPageTitle}from'@/utils/usePageTitle';
import{WritingRatingResponse}from'@/types/writing';
export default function WritingReviewPage(){
useTestPageTitle();
const r=useRouter();
const p=useParams();
const {user,loading}=useAuth();
const {id,type}=p as {id:string;type:string};
const [pt,setPt]=useState('');
const [pc,setPc]=useState('');
const [essay,setEssay]=useState('');
const [rating,setRating]=useState<WritingRatingResponse|null>(null);
const [isLoading,setIsLoading]=useState(false);
const [essayLoading,setEssayLoading]=useState(false);
const [error,setError]=useState('');
useEffect(()=>{
if(!loading&&!user)r.push('/login');
},[user,loading,r]);
useEffect(()=>{
(async()=>{
const {title,content}=await ldp(id,type);
setPt(title);
setPc(content);
})();
},[id,type]);
useEffect(()=>{
if(user&&id&&type){
setEssayLoading(true);
setError('');
fetch(`/answers/essay/${user.id}/${id}/${type}`).then(res=>res.json()).then(data=>{
console.log('Essay API response:',data);
if(data.success&&data.data)setEssay(data.data.essay_text);
else{
const saved=localStorage.getItem(`writing-answers-${id}-${type}`);
if(saved)setEssay(saved);
else setError('No essay found for this task');
}
setEssayLoading(false);
}).catch((e)=>{
console.error('Essay API error:',e);
const saved=localStorage.getItem(`writing-answers-${id}-${type}`);
if(saved)setEssay(saved);
else setError('Failed to load essay');
setEssayLoading(false);
});
}
},[user,id,type]);
const getFeedback=useCallback(async()=>{
if(!essay||!pc)return;
setIsLoading(true);
setError('');
try{
const result=await getWritingRating(essay,`${pt}\n\n${pc}`);
setRating(result);
}catch{
setError('Failed to get AI feedback. Please try again.');
}finally{
setIsLoading(false);
}
},[essay,pc,pt]);
useEffect(()=>{
if(essay&&pc&&!rating&&!isLoading&&!error)getFeedback();
},[essay,pc,pt,rating,isLoading,error,getFeedback]);
const hn=(d:'back'|'next')=>{
if(d==='back'){
r.push('/dashboard?tab=Writing');
}else{
const nt=Number(type)+1;
if(nt>=1&&nt<=4)r.push(`/writing/${id}/${nt}/review`);
}
};
if(loading)return(<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>);
if(!user)return null;
if(pt===''||pc==='Failed to load writing prompt.')return(<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Failed to load writing prompt.</div></div>);
return(<div className="min-h-screen bg-black text-black p-6 flex flex-col">
<div className="w-full flex justify-between mb-4">
<div className="w-6">
<button onClick={()=>r.push('/dashboard?tab=Writing')} className="text-white hover:text-blue-500 transition">
<Home className="w-6 h-6"/>
</button>
</div>
<div className="flex-1 flex justify-center">
<h1 className="text-white text-2xl font-bold">Review: Writing Task {type}</h1>
</div>
<div className="w-6"></div>
</div>
<div className="flex w-full gap-4">
<div className="w-2/8 bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<h2 className="text-xl font-bold mb-4">Writing Prompt</h2>
<div className="mb-4">
<h3 className="font-semibold text-lg">{pt}</h3>
</div>
<div className="whitespace-pre-wrap text-sm text-gray-700">{pc}</div>
</div>
<div className="w-3/8 bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<h2 className="text-xl font-bold mb-4">Your Essay</h2>
{essayLoading?(<div className="flex items-center justify-center h-32 text-gray-500">Loading essay...</div>):essay?(<div>
<div className="whitespace-pre-wrap text-sm text-gray-700 mb-4">{essay}</div>
<div className="text-xs text-gray-500">
Word Count: {essay.split(' ').filter(w=>w.length>0).length}
</div>
</div>):(<div className="text-center text-gray-500 mt-4">No essay submitted for this task</div>)}
</div>
<div className="w-3/8 bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<h2 className="text-xl font-bold mb-4">AI Feedback</h2>
{isLoading?(<div className="flex items-center justify-center h-32 text-gray-500">Analyzing your essay...</div>):rating?(<div className="space-y-4">
<div className="bg-gray-50 p-4 rounded-lg">
<h3 className="font-semibold mb-2">IELTS Writing Scores</h3>
<div className="space-y-2 text-sm">
<div className="flex justify-between">
<span>Task Achievement:</span>
<span className="font-semibold">{rating.rating.taskAchievement}</span>
</div>
<div className="flex justify-between">
<span>Coherence & Cohesion:</span>
<span className="font-semibold">{rating.rating.coherenceCohesion}</span>
</div>
<div className="flex justify-between">
<span>Lexical Resource:</span>
<span className="font-semibold">{rating.rating.lexicalResource}</span>
</div>
<div className="flex justify-between">
<span>Grammatical Range & Accuracy:</span>
<span className="font-semibold">{rating.rating.grammaticalRangeAccuracy}</span>
</div>
<div className="border-t pt-2 mt-2">
<div className="flex justify-between font-bold">
<span>Final Score:</span>
<span className="text-blue-600">{rating.finalScore}</span>
</div>
<div className="text-xs text-gray-500">
Average: {rating.averageScore.toFixed(1)}
</div>
</div>
</div>
</div>
<div className="bg-blue-50 p-4 rounded-lg">
<h3 className="font-semibold mb-2">Detailed Feedback</h3>
<div className="whitespace-pre-wrap text-sm text-gray-700">{rating.feedback}</div>
</div>
<div className="text-xs text-gray-400 italic">
Generated by Unbabel AI
</div>
</div>):error?(<div className="text-center text-red-500 mt-4">
<div className="mb-2">{error}</div>
<button onClick={getFeedback} disabled={isLoading} className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300">
<RefreshCw className={`w-4 h-4 ${isLoading?'animate-spin':''}`}/>
<span>Retry</span>
</button>
</div>):(<div className="text-center text-gray-500 mt-4">No feedback available</div>)}
</div>
</div>
<div className="w-full flex justify-center mt-6 space-x-4">
<button onClick={()=>hn('back')} disabled={type==='1'} className={`px-6 py-2 rounded-lg transition-colors ${type==='1'?'bg-gray-300 cursor-not-allowed text-gray-500':'bg-blue-500 hover:bg-blue-600 text-white'}`}>
Back
</button>
<button onClick={()=>hn('next')} disabled={type==='4'} className={`px-6 py-2 rounded-lg transition-colors ${type==='4'?'bg-gray-300 cursor-not-allowed text-gray-500':'bg-blue-500 hover:bg-blue-600 text-white'}`}>
Next
</button>
</div>
</div>);
}