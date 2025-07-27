'use client';
import{useRouter}from'next/navigation';
import{useAuth}from'@/contexts/AuthContext';
import{ProtectedRoute}from'@/components/ProtectedRoute';
import{Home,LogOut}from'lucide-react';
import{useState,useEffect}from'react';
const t=['Reading','Listening','Speaking','Writing','AI Quiz'];
interface DynamicQuestion{type:string;question:string;options:string[];correct:string;}
export default function DashboardPage(){
const r=useRouter();const{user,logout}=useAuth();const[at,setAt]=useState('Reading');const[ao,setAo]=useState('Context Understanding');const[cq,setCq]=useState(0);const[a,setA]=useState<Record<number,{selected:string;submitted:boolean}>>({});const[dq,setDq]=useState<DynamicQuestion[]>([]);const[ilq,setIlq]=useState(false);
const hl=()=>{logout();r.push('/login');};
const htc=(t:string)=>{setAt(t);};
const gqfl=async(qt:string)=>{setIlq(true);try{const p={'Context Understanding':`You are an expert IELTS tutor creating context understanding questions.

Background: Create a multiple choice question that tests the student's ability to understand context and choose the most appropriate word or phrase that fits a given situation. This should simulate real-world language use scenarios.

Requirements:
- Create a realistic scenario or context (business, academic, social, or everyday situations)
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Focus on vocabulary, idioms, phrasal verbs, or contextual understanding
- Include scenarios like: workplace communication, academic discussions, social interactions, or daily conversations
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong in the given context

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`,'English to English':`You are an expert IELTS tutor creating English to English vocabulary questions.

Background: Create a multiple choice question that tests the student's knowledge of English synonyms, antonyms, or word relationships. This should help students expand their vocabulary and understand word nuances.

Requirements:
- Focus on vocabulary building and word relationships
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Include topics like: synonyms, antonyms, word associations, collocations, or academic vocabulary
- Focus on words commonly used in IELTS contexts (academic, formal, or everyday language)
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong
- The question should test understanding of word meanings and usage

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`,'Grammar MCQ':`You are an expert IELTS tutor creating grammar multiple choice questions.

Background: Create a multiple choice question that tests the student's understanding of English grammar rules. The question should focus on common grammar topics that IELTS students often struggle with.

Requirements:
- Focus on common grammar mistakes and rules that IELTS students encounter
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Include topics like: verb tenses (present perfect, past perfect, future perfect), articles (a, an, the), prepositions, modal verbs, conditionals, passive voice, reported speech, relative clauses, or sentence structure
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong
- The question should test understanding, not just memorization

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`};const pr=p[qt as keyof typeof p];const res=await fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:pr})});if(!res.ok)throw new Error(`API request failed: ${res.status}`);const d=await res.json();const gt=d.generated_text||d[0]?.generated_text||'';if(!gt)throw new Error('No response from LLM');let jt=gt.trim();if(jt.includes('```json'))jt=jt.split('```json')[1]?.split('```')[0]||jt;else if(jt.includes('```'))jt=jt.split('```')[1]||jt;try{const pq=JSON.parse(jt);if(pq.question&&pq.options&&pq.correct){const nq:DynamicQuestion={type:qt,question:pq.question,options:pq.options,correct:pq.correct};setDq(prev=>[...prev,nq]);}else{throw new Error('Invalid question format - missing required fields');}}catch(pe){console.error('Failed to parse LLM response:',pe);console.error('Raw response:',gt);const fq={'Context Understanding':{question:'In a business meeting, when someone says "Let\'s touch base next week," they mean:',options:['Let\'s meet next week','Let\'s call each other next week','Let\'s send emails next week','Let\'s avoid each other next week'],correct:'Let\'s meet next week'},'English to English':{question:'Which word is a synonym for "excellent"?',options:['Good','Outstanding','Average','Poor'],correct:'Outstanding'},'Grammar MCQ':{question:'Choose the correct form: "She _____ to the store yesterday."',options:['go','goes','went','gone'],correct:'went'}};const f=fq[qt as keyof typeof fq]||{question:'What is the capital of Australia?',options:['Sydney','Melbourne','Canberra','Perth'],correct:'Canberra'};const nq:DynamicQuestion={type:qt,question:f.question,options:f.options,correct:f.correct};setDq(prev=>[...prev,nq]);}}catch(e){console.error('Error generating question:',e);const fq={'Context Understanding':{question:'In a business meeting, when someone says "Let\'s touch base next week," they mean:',options:['Let\'s meet next week','Let\'s call each other next week','Let\'s send emails next week','Let\'s avoid each other next week'],correct:'Let\'s meet next week'},'English to English':{question:'Which word is a synonym for "excellent"?',options:['Good','Outstanding','Average','Poor'],correct:'Outstanding'},'Grammar MCQ':{question:'Choose the correct form: "She _____ to the store yesterday."',options:['go','goes','went','gone'],correct:'went'}};const f=fq[qt as keyof typeof fq]||{question:'What is the capital of Australia?',options:['Sydney','Melbourne','Canberra','Perth'],correct:'Canberra'};const nq:DynamicQuestion={type:qt,question:f.question,options:f.options,correct:f.correct};setDq(prev=>[...prev,nq]);}finally{setIlq(false);}};
const hoc=(o:string)=>{setAo(o);setCq(0);setA({});setDq([]);gqfl(o);};
useEffect(()=>{if(at==='AI Quiz'&&dq.length===0)gqfl(ao);},[at,ao,dq.length]);
const cqs=dq.filter(q=>q.type===ao);const q=cqs[cq];const ans=a[cq]||{selected:'',submitted:false};
return(<ProtectedRoute><div className="min-h-screen bg-black text-white flex"><aside className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-6"><button onClick={()=>r.push('/dashboard')} className="mb-6"><Home className="w-6 h-6 text-white"/></button><div className="mt-auto mb-4 flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer" onClick={()=>r.push('/profile')}>{user?.firstName?.charAt(0)||'U'}</div><span className="text-xs mt-1 text-white cursor-pointer" onClick={()=>r.push('/profile')}>Profile</span><button onClick={hl} className="mt-2"><LogOut className="w-4 h-4 text-gray-400 hover:text-white"/></button></div></aside><main className="ml-16 flex-1 p-6 overflow-y-auto relative"><div className="absolute top-0 right-0 p-4"><button onClick={hl} className="text-sm text-white border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 transition">Logout</button></div><div className="flex space-x-6 border-b border-gray-700 mb-6">{t.map(tab=>(<button key={tab} onClick={()=>htc(tab)} className={`pb-2 text-lg ${at===tab?'border-b-2 border-white font-semibold':'text-gray-400'}`}>{tab==='AI Quiz'?(<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">{tab}</span>):tab}</button>))}</div>{at==='AI Quiz'?(<div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-white flex flex-col h-[70vh]"><div className="flex space-x-4 mb-4">{['Context Understanding','English to English','Grammar MCQ'].map(opt=>(<button key={opt} onClick={()=>hoc(opt)} className={`px-4 py-2 rounded ${ao===opt?'bg-white text-black font-semibold':'bg-gray-700'}`}>{opt}</button>))}</div><div className="bg-gray-700 text-white p-4 rounded-xl mb-4 flex-1 overflow-auto"><p className="text-lg font-semibold mb-2">Q{cq+1}:</p>{ilq?(<div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div><span className="ml-3">Generating question...</span></div>):q?(<p className="text-base">{q.question}</p>):(<p className="text-base text-gray-400">No questions available</p>)}</div><div className="mt-2">{q&&!ilq&&(<><div className="grid grid-cols-2 gap-4 mb-4">{q.options.map((opt,idx)=>{let bc='w-full py-4 px-4 rounded text-lg text-left border';if(ans.submitted){if(opt===q.correct)bc+=' bg-green-700 border-green-400';else if(opt===ans.selected)bc+=' bg-red-700 border-red-400';else bc+=' bg-gray-700';}else if(opt===ans.selected)bc+=' bg-blue-700 border-blue-400';else bc+=' bg-gray-600';return(<button key={idx} className={bc} onClick={()=>{if(!ans.submitted)setA(prev=>({...prev,[cq]:{selected:opt,submitted:false}}));}}>{opt}</button>);})}</div><div className="flex justify-between"><button disabled={cq===0} onClick={()=>setCq(prev=>prev-1)} className={`px-4 py-2 rounded ${cq===0?'bg-gray-600 cursor-not-allowed text-gray-400':'bg-blue-600 hover:bg-blue-700 text-white'}`}>Back</button>{ans.submitted?(<button onClick={()=>{if(cq<cqs.length-1)setCq(prev=>prev+1);else{gqfl(ao);setCq(prev=>prev+1);}}} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Next</button>):(<div className="flex gap-4"><button onClick={()=>{setA(prev=>({...prev,[cq]:{selected:ans.selected||'',submitted:false}}));if(cq<cqs.length-1)setCq(prev=>prev+1);}} className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white">Skip</button><button onClick={()=>{if(!ans.selected)return;setA(prev=>({...prev,[cq]:{...prev[cq],submitted:true}}));}} className={`px-4 py-2 rounded ${ans.selected?'bg-red-500 hover:bg-red-600 text-white':'bg-gray-500 text-gray-300 cursor-not-allowed'}`} disabled={!ans.selected}>Submit</button></div>)}</div></>)}</div></div>):Array.from({length:20},(_,i)=>{const cs=20-i;return(<div key={i} className="mb-8"><h2 className="text-white text-xl font-semibold mb-4">IELTS Cambridge {cs}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:4},(_,j)=>{const tn=j+1;return(<div key={tn} onClick={()=>r.push(`/${at.toLowerCase()}/${cs}/${tn}`)} className="border border-gray-600 bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"><div className="text-white text-lg font-medium mb-2">Test {tn}</div><div className="text-gray-400 text-sm">Click to Start</div></div>);})}</div></div>);})}</main></div></ProtectedRoute>);}
