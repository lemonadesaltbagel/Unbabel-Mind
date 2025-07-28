'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/types/reading';
import { ld, sv, ldp, ldq, sub, ldh, svh } from '@/utils/listening';
import { showToast } from '@/utils/toast';
import ListeningTranscript from '@/components/ListeningTranscript';
import QuestionList from '@/components/QuestionList';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';
export default function ListeningPage(){
useTestPageTitle();
const r=useRouter();
const p=useParams();
const {user,loading}=useAuth();
const {id,type}=p as {id:string;type:string};
const pid=Number(id);
const qt=Number(type);
const lk=`listening-answers-${id}-${type}`;
const [pt,setPt]=useState('');
const [qs,setQs]=useState<Question[]>([]);
const [a,setA]=useState<Record<number,string[]>>({});
const [is,setIs]=useState(false);
const [highlights,setHighlights]=useState<{text:string;start:number;end:number}[]>([]);
const il=useRef(true);
useEffect(()=>{
if(!loading&&!user){
r.push('/login');
return;}}, [user,loading,r]);
useEffect(()=>{
setA(ld(id,type));
il.current=true;}, [id,type]);
useEffect(()=>{
if(!il.current)sv(id,type,a);}, [a,id,type]);
useEffect(()=>{
(async()=>{
const {title}=await ldp(id,type);
setPt(title);})();}, [id,type]);
useEffect(()=>{
(async()=>{
setQs(await ldq(id,type));})();}, [id,type]);
useEffect(()=>{
setHighlights(ldh(id,type));}, [id,type]);
useEffect(()=>{
svh(id,type,highlights);}, [highlights,id,type]);
const hsub=async()=>{
if(is)return;
setIs(true);
const pl={
passageId:pid,
questionType:qt,
userId:Number(user?.id)||123,
answers:Object.entries(a).map(([qi,ua])=>({
questionId:Number(qi),
userAnswer:ua}))};
const {ok,message,score,correctAnswers,totalQuestions}=await sub(pl);
if(ok){
if(score!==undefined){
showToast(`Submission successful! Score: ${score}% (${correctAnswers}/${totalQuestions} correct)`);
}else{
showToast('Submission successful!');}
localStorage.removeItem(lk);
r.push(`/listening/${id}/${type}/review`);}else{
showToast(message,true);}
setIs(false);};
const hn=(d:'back'|'next')=>{
const nt=d==='back'?qt-1:qt+1;
if(nt>=1&&nt<=4){
r.push(`/listening/${id}/${nt}`);}};
if(loading)return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
if(!user)return null;
const isContentMissing=pt===''||(qs.length===1&&qs[0].type==='intro'&&qs[0].text==='Failed to load questions.');
if(isContentMissing)return<CopyrightMessage quizType="listening" quizId={id} questionType={type}/>;
return(
<div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
<div className="w-full max-w-6xl flex justify-start mb-4">
<button onClick={()=>r.push('/dashboard')}>
<Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
</button>
</div>
<div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl">
<ListeningTranscript title={pt} />
<QuestionList questions={qs} answers={a} setAnswers={setA} />
</div>
<ReadingControls questionType={qt} isSubmitting={is} onSubmit={hsub} onNavigate={hn} />
</div>);} 