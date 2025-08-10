'use client';
import {useParams,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {Home} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext';
import {ldp,getWritingRating} from '@/utils/writing';
import {useTestPageTitle} from '@/utils/usePageTitle';
import {checkTokenAndWarn} from '@/utils/tokenCheck';
import {WritingRatingResponse} from '@/types/writing';
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
const [rating,setRating]=useState<WritingRatingResponse|null>(null);
const [showRating,setShowRating]=useState(false);
 const [sampleAnswer,setSampleAnswer]=useState('');
const [showSample,setShowSample]=useState(false);
useEffect(()=>{if(!loading&&!user)r.push('/login');},[loading,user,r]);
useEffect(()=>{(async()=>{const {title,content}=await ldp(id,type);setT(title);setC(content);})();
const s=localStorage.getItem(`writing-answers-${id}-${type}`);
if(s)setE(s);},[id,type]);
useEffect(()=>{if(!e)return;setI(true);
const p=`You are an IELTS writing expert. Please review the following essay:\n\n"${e}"\n\nGive specific suggestions to improve it in terms of grammar, structure, coherence, and task response. Reply with bullet points.`;
checkTokenAndWarn().then(hasToken=>{if(hasToken){fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}).then(res=>res.json()).then(data=>{setA(data.generated_text||'No response.');setI(false);}).catch(()=>{setA('Error fetching suggestions.');setI(false);});}else{setA('Please configure your OpenAI API token in your profile to use AI features.');setI(false);}});},[e]);
const getRating=async()=>{if(!e||!c)return;setI(true);try{const r=await getWritingRating(e,c);setRating(r);setShowRating(true);}catch{setRating(null);}finally{setI(false);}};
const getSampleAnswer=async()=>{if(!c)return;setI(true);try{const p=`You are an expert IELTS writing tutor. Write a high-quality sample answer (Band 8-9) for the following IELTS Writing Task 2 prompt:

"${t}"

${c}

Write a well-structured essay that demonstrates:
- Clear introduction with thesis statement
- Well-developed body paragraphs with examples
- Strong conclusion
- Advanced vocabulary and grammar
- Coherent organization
- Approximately 250-300 words

Respond with the essay only, no explanations.`;
const res=await fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
if(!res.ok)throw new Error('Failed to get sample answer');
const data=await res.json();
setSampleAnswer(data.generated_text||'No sample answer available.');
setShowSample(true);
}catch{setSampleAnswer('Error generating sample answer.');}finally{setI(false);}};
if(loading)return <div className="text-white">Loading...</div>;
if(!user)return null;
return(<div className="min-h-screen bg-black text-white p-4"><div className="mb-2"><Home className="w-6 h-6 cursor-pointer hover:text-gray-300" onClick={()=>r.push('/dashboard')}/></div><div className="flex max-w-7xl w-full space-x-4 mt-6 mx-auto"><div className="basis-[30%] bg-white text-black p-6 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow overflow-y-auto h-[80vh]"><h2 className="text-xl font-bold mb-4">Writing Prompt</h2><h3 className="text-lg font-semibold mb-2">{t}</h3><div className="text-sm whitespace-pre-wrap">{c}</div></div><div className="basis-[30%] bg-white text-black p-6 rounded-xl shadow overflow-y-auto h-[80vh]"><h2 className="text-xl font-bold mb-4">Your Essay</h2><div className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{e}</div></div><div className="basis-[40%] bg-white text-black p-6 rounded-xl shadow overflow-y-auto h-[80vh]"><div className="flex gap-2 mb-4"><button className="flex-1 py-2 bg-gray-100 text-gray-800 rounded font-semibold text-center" onClick={()=>{setShowRating(false);setShowSample(false);}}>Feedback</button><button className="flex-1 py-2 bg-blue-500 text-white rounded font-semibold text-center" onClick={getRating}>Get Rating</button><button className="flex-1 py-2 bg-green-500 text-white rounded font-semibold text-center" onClick={getSampleAnswer}>Sample Answer</button></div>{showRating&&rating?(<div className="space-y-4"><h3 className="text-lg font-bold text-center">IELTS Writing Score</h3><div className="grid grid-cols-2 gap-4 text-sm"><div className="bg-gray-50 p-3 rounded"><div className="font-semibold">Task Achievement</div><div className="text-2xl font-bold text-blue-600">{rating.rating.taskAchievement}</div></div><div className="bg-gray-50 p-3 rounded"><div className="font-semibold">Coherence & Cohesion</div><div className="text-2xl font-bold text-blue-600">{rating.rating.coherenceCohesion}</div></div><div className="bg-gray-50 p-3 rounded"><div className="font-semibold">Lexical Resource</div><div className="text-2xl font-bold text-blue-600">{rating.rating.lexicalResource}</div></div><div className="bg-gray-50 p-3 rounded"><div className="font-semibold">Grammatical Range</div><div className="text-2xl font-bold text-blue-600">{rating.rating.grammaticalRangeAccuracy}</div></div></div><div className="bg-blue-50 p-4 rounded text-center"><div className="text-sm text-gray-600">Average Score</div><div className="text-3xl font-bold text-blue-600">{rating.averageScore.toFixed(1)}</div><div className="text-sm text-gray-600">Final Score</div><div className="text-2xl font-bold text-green-600">{rating.finalScore}</div></div><div className="bg-gray-50 p-3 rounded"><div className="font-semibold mb-2">Detailed Feedback</div><div className="text-sm whitespace-pre-wrap">{rating.feedback}</div></div></div>):showSample?(<div className="space-y-4"><h3 className="text-lg font-bold text-center">Sample Answer (Band 8-9)</h3><div className="bg-green-50 p-4 rounded border-l-4 border-green-500"><div className="text-sm whitespace-pre-wrap">{sampleAnswer}</div></div></div>):(<div><p className="text-center text-sm text-gray-500 mb-6">Get Started with Unbabel for IELTS</p>{i?<div className="text-gray-500">Generating...</div>:<div className="text-sm whitespace-pre-wrap">{a}</div>}</div>)}</div></div></div>);}