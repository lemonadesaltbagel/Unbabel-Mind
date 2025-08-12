"use client";
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState,useRef}from'react';
import{Home}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{ldp,ldq,ldh,lde,getResultsWithCorrectAnswers}from'@/utils/reading';
import{useTestPageTitle}from'@/utils/usePageTitle';
import{checkTokenAndWarn}from'@/utils/tokenCheck';
interface Question{type:string;text?:string;number?:number;question?:string;options?:string[];correctAnswer?:string;}
interface Highlight{text:string;start:number;end:number;}
export default function ReviewPage(){
useTestPageTitle();
const r=useRouter();
const p=useParams();
const{user,loading}=useAuth();
const{id,type}=p as{id:string;type:string};
const[pt,setPt]=useState('');
const[pc,setPc]=useState('');
const[qs,setQs]=useState<Question[]>([]);
const[highlights,setHighlights]=useState<Highlight[]>([]);
const[showContextMenu,setShowContextMenu]=useState(false);
const[contextMenuPosition,setContextMenuPosition]=useState({x:0,y:0});
const contextMenuRef=useRef<HTMLDivElement>(null);
const[aiResponse,setAiResponse]=useState('');
const[isLoading,setIsLoading]=useState(false);
const[evidence,setEvidence]=useState<{number:number;text:string}[]>([]);
const[aiSuggestions,setAiSuggestions]=useState<string[]>([]);
const[results,setResults]=useState<{questionId:number;userAnswer:string[];correctAnswer:string;isCorrect:boolean}[]>([]);
useEffect(()=>{
if(!loading&&!user){r.push('/login');return;}
},[user,loading,r]);
useEffect(()=>{
(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();
(async()=>setQs(await ldq(id,type)))();
(async()=>{if(user){const backendResults=await getResultsWithCorrectAnswers(Number(user.id),Number(id),Number(type));setResults(backendResults);}})();
setHighlights(ldh(id,type));
(async()=>setEvidence(await lde(id,type)))();
},[id,type,user]);
useEffect(()=>{
if(qs.length>0&&results.length>0&&evidence.length>0){
const wrongQuestions=results.filter(r=>!r.isCorrect).map(r=>{const q=qs.find(q=>q.number===r.questionId);return{...q,userAnswer:r.userAnswer[0]||'',correctAnswer:r.correctAnswer};});
if(wrongQuestions.length===0){setAiSuggestions(["Focus on reading comprehension strategies","Practice identifying key information in passages","Work on vocabulary building exercises","Review question types you struggled with"]);return;}
setIsLoading(true);
const prompt=`You are an expert IELTS tutor with deep knowledge of reading comprehension strategies and test preparation.

Background: The user has completed a reading comprehension test and made some mistakes. Your task is to analyze their performance and provide personalized improvement suggestions.

Wrong Questions Analysis:
${wrongQuestions.map(q=>`- Question ${q.number}: ${q.question}
    Type: ${q.type}
    User Answer: ${q.userAnswer}
    Correct Answer: ${q.correctAnswer}
    Evidence: ${evidence.filter(e=>e.number===q.number).map(e=>e.text).join('; ')}`).join('\n')}

Please provide 4-6 specific, actionable suggestions to help the user improve their reading comprehension skills based on their mistakes. Focus on the specific question types and skills they struggled with.

Respond with plain text suggestions only, one per line, without any formatting or JSON structure.`;
callGptApi(prompt).then(response=>{try{const suggestions=response.split('\n').map(line=>line.trim()).filter(line=>line.length>0).slice(0,6);if(suggestions.length>0){setAiSuggestions(suggestions);}else{setAiSuggestions(["Focus on reading comprehension strategies","Practice identifying key information in passages","Work on vocabulary building exercises","Review question types you struggled with"]);}}catch{setAiSuggestions(["Focus on reading comprehension strategies","Practice identifying key information in passages","Work on vocabulary building exercises","Review question types you struggled with"]);}}).finally(()=>{setIsLoading(false);});}
},[qs,results,evidence]);
const callGptApi=async(prompt:string):Promise<string>=>{try{const hasToken=await checkTokenAndWarn();if(!hasToken)return'Please configure your OpenAI API token in your profile to use AI features.';const res=await fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}),});const data=await res.json();if(Array.isArray(data)&&data[0]?.generated_text)return data[0].generated_text;if(data.generated_text)return data.generated_text;return JSON.stringify(data);}catch{return'Error calling Unbabel API.';}};
const hn=(d:'back'|'next')=>{if(d==='back')r.push('/dashboard?tab=Reading');else{const nt=Number(type)+1;if(nt>=1&&nt<=4)r.push(`/reading/${id}/${nt}`);}};
const hcm=(e:React.MouseEvent)=>{e.preventDefault();setContextMenuPosition({x:e.pageX,y:e.pageY});setShowContextMenu(true);};
const hh=()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();const r=s.getRangeAt(0);const pcr=r.cloneRange();pcr.selectNodeContents(document.querySelector('.passage-content')as Node);pcr.setEnd(r.startContainer,r.startOffset);const start=pcr.toString().length;setHighlights(prev=>[...prev,{text:st,start,end:start+st.length}]);setShowContextMenu(false);};
const hch=()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();const r=s.getRangeAt(0);const pcr=r.cloneRange();pcr.selectNodeContents(document.querySelector('.passage-content')as Node);pcr.setEnd(r.startContainer,r.startOffset);const start=pcr.toString().length;const end=start+st.length;setHighlights(prev=>prev.filter(h=>!(start<=h.end&&end>=h.start)));setShowContextMenu(false);};
const hp=async()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();if(!st)return;setIsLoading(true);try{const prompt=`You are an expert IELTS tutor helping students understand complex vocabulary. Your task is to paraphrase the selected text using simpler, more common words while maintaining the same meaning.\n\nText: \"${st}\"\n\nPlease paraphrase using simpler vocabulary for B1-B2 level learners.`;const response=await callGptApi(prompt);setAiResponse(response);}finally{setIsLoading(false);setShowContextMenu(false);}};
const he=async(qn:number,ua:string,ca:string)=>{setIsLoading(true);try{const q=qs.find(q=>q.number===qn);if(!q)return;const qEvidence=evidence.filter(e=>e.number===qn);const backgroundInfo=`This is an IELTS Reading test. The user is reviewing their performance on question ${qn} of passage ${id}, type ${type}.`;const prompt=`You are an expert IELTS tutor with deep knowledge of reading comprehension strategies and test preparation.

Background Setting:
${backgroundInfo}

Question Analysis:
- Question Number: ${qn}
- Question Type: ${q.type}
- Question: ${q.question}
- Available Options: ${q.options?.join(', ')||'N/A'}
- User's Answer: "${ua}"
- Correct Answer: "${ca}"

Evidence from Reading Passage:
${qEvidence.map(e=>`- Evidence ${e.number}: ${e.text}`).join('\n')}

Your Task:
1. Analyze why the correct answer "${ca}" is the right choice based on the evidence provided
2. Analyze why the user might have chosen "${ua}" - what could have led to this mistake?
3. Identify the specific reading skills or strategies the user needs to improve
4. Provide specific, actionable suggestions for improvement

IMPORTANT: Respond in plain text format, NOT JSON. Structure your response as follows:

**Why the correct answer is right:**
[Your explanation here]

**Why the user made this mistake:**
[Your analysis here]

**Skills to improve:**
[Specific reading skills that need work]

**Suggestions:**
[3-4 actionable tips for improvement]

Keep your response concise, clear, encouraging, and focused on helping the user improve their reading comprehension skills.`;const response=await callGptApi(prompt);setAiResponse(response);}finally{setIsLoading(false);}};
useEffect(()=>{const handleClickOutside=(event:MouseEvent)=>{if(contextMenuRef.current&&!contextMenuRef.current.contains(event.target as Node)){setShowContextMenu(false);}};document.addEventListener('click',handleClickOutside);return()=>document.removeEventListener('click',handleClickOutside);},[]);
if(loading)return<div className="min-h-screen bg-black flex justify-center"><div className="text-white text-xl">Loading...</div></div>;
if(!user)return null;
return(<div className="min-h-screen bg-black text-black p-6 flex flex-col">
<div className="w-full flex justify-between mb-4">
<div className="w-6">
<button onClick={()=>r.push('/dashboard?tab=Reading')} className="text-white hover:text-blue-500 transition">
<Home className="w-6 h-6" />
</button>
</div>
<div className="flex-1 flex justify-center">
<h1 className="text-white text-2xl font-bold">Review: Reading Passage {type}</h1>
</div>
<div className="w-6"></div>
</div>
<div className="flex w-full gap-4">
<div className="w-1/4">
<div className="bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<div className="mb-4 font-bold text-lg">Unbabel AI</div>
{isLoading?(<div className="flex justify-center h-32 text-gray-500">Loading...</div>):aiResponse?(<div className="prose prose-sm max-w-none">
<div className="whitespace-pre-wrap text-gray-700">{aiResponse}</div>
</div>):(<div className="text-center text-gray-500 mt-4">Get Started with Unbabel for IELTS</div>)}
</div>
</div>
<div className="w-2/4">
<div className="bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<h2 className="text-xl font-bold mb-2">{pt}</h2>
<div className="whitespace-pre-wrap text-sm passage-content" onContextMenu={hcm}>
{(()=>{let lastIndex=0;const sortedHighlights=[...highlights].sort((a,b)=>a.start-b.start);const result=[];sortedHighlights.forEach((highlight,index)=>{if(highlight.start>lastIndex){result.push(<span key={`text-${index}`}>{pc.slice(lastIndex,highlight.start)}</span>);}result.push(<span key={`highlight-${index}`} className="bg-yellow-200">{pc.slice(highlight.start,highlight.end)}</span>);lastIndex=highlight.end;});if(lastIndex<pc.length){result.push(<span key="text-last">{pc.slice(lastIndex)}</span>);}return result;})()}
</div>
{showContextMenu&&(<div ref={contextMenuRef} className="fixed bg-white shadow-lg rounded-md py-2 z-50" style={{left:contextMenuPosition.x,top:contextMenuPosition.y}}>
<button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hh}>Highlight</button>
<button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hch}>Clear Highlight</button>
<button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hp}>Unbabel Paraphrase</button>
</div>)}
</div>
</div>
<div className="w-1/4">
<div className="bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
<h2 className="text-xl font-bold mb-4">Your Answers</h2>
<ol className="space-y-4 text-sm">
{qs.map((q,i)=>{if(!('number'in q)||!q.number)return null;const result=results.find(r=>r.questionId===q.number);if(!result)return null;const userAns=result.userAnswer[0]||'';const correct=result.correctAnswer;const isCorrect=result.isCorrect;return(<li key={i}>
<div className="mb-1 font-semibold">{q.number}. {q.question}</div>
<div className={isCorrect?'text-green-600':'text-red-600'}>
Your Answer: {userAns||'—'}
</div>
{!isCorrect&&(<>
<div className="text-blue-600">Correct Answer: {correct||'N/A'}</div>
<button className="mt-2 px-4 py-2 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-500 text-sm font-semibold shadow-2xl hover:shadow-orange-500/40 transform hover:-translate-y-0.5 border border-orange-300/40 hover:border-orange-200/60 relative overflow-hidden group backdrop-blur-sm" onClick={()=>he(q.number!,userAns,correct||'')}>
<span className="relative z-10 flex justify-center tracking-wide">
<svg className="w-4 h-4 mr-2 text-orange-100" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
</svg>
Unbabel AI
</span>
<div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-orange-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 via-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-indigo-400 via-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
</button>
</>)}
</li>);})}
</ol>
<div className="mt-8 pt-4 border-t border-gray-200">
<h3 className="text-lg font-semibold mb-2">Conclusion</h3>
<div className="text-sm text-gray-600 space-y-2">
<p>Total Questions: {results.length}</p>
<p>Correct Answers: {results.filter(r=>r.isCorrect).length}</p>
<p className="font-medium">
Score: {results.length>0?Math.round((results.filter(r=>r.isCorrect).length/results.length)*100):0}%
</p>
<p className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-medium mt-4 text-center">
<svg className="w-3 h-3 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
</svg>
Generated by <span className="bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">Unbabel AI</span>
</p>
</div>
</div>
<div className="mt-6 pt-4 border-t border-gray-200">
<h3 className="text-lg font-semibold mb-2">Unbabel Suggestion</h3>
<div className="text-sm text-gray-600 space-y-2">
<p className="text-blue-600 font-medium">This is Unbabel suggestion based on your performance in this test</p>
{isLoading?(<div className="flex justify-center py-4 text-gray-500">Generating personalized suggestions...</div>):(<ul className="list-disc list-inside space-y-1 text-xs">
{aiSuggestions.map((suggestion,index)=>(<li key={index}>{suggestion}</li>))}
</ul>)}
<p className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-medium mt-4 text-center">
<svg className="w-3 h-3 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
</svg>
Personalized by <span className="bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">Unbabel AI</span>
</p>
</div>
</div>
</div>
</div>
</div>
<div className="w-full flex justify-center mt-6 space-x-4">
<button onClick={()=>hn('back')} className="px-8 py-2 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap">
Back to Dashboard
</button>
<button onClick={()=>hn('next')} disabled={type==='3'} className={`px-8 py-2 rounded-lg transition-colors whitespace-nowrap ${type==='3'?'bg-gray-300 cursor-not-allowed text-gray-500':'bg-blue-500 hover:bg-blue-600 text-white'}`}>
Next Exercise
</button>
</div>
</div>);}