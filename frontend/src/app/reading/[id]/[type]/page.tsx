'use client';
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState,useRef}from'react';
import{Home}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{Question,Highlight,Answers}from'@/types/reading';
import{ld,sv,ldh,svh,ldp,ldq,sub}from'@/utils/reading';
import{showToast}from'@/utils/toast';
import{createContextMenu,getTextPosition}from'@/utils/contextMenu';
import ReadingPassage from'@/components/ReadingPassage';
import QuestionList from'@/components/QuestionList';
import ReadingControls from'@/components/ReadingControls';
import{useTestPageTitle}from'@/utils/usePageTitle';
export default function ReadingPage(){
useTestPageTitle();
const r=useRouter();const p=useParams();const{user,loading}=useAuth();const{id,type}=p as{id:string;type:string};const pid=Number(id);const qt=Number(type);const lk=`reading-answers-${id}-${type}`;const[pt,setPt]=useState('');const[pc,setPc]=useState('Loading passage...');const[qs,setQs]=useState<Question[]>([]);const[a,setA]=useState<Answers>({});const[is,setIs]=useState(false);const[highlights,setHighlights]=useState<Highlight[]>([]);const il=useRef(true);
useEffect(()=>{if(!loading&&!user){r.push('/login');return;}},[user,loading,r]);
useEffect(()=>{setA(ld(id,type));il.current=true;},[id,type]);
useEffect(()=>{if(!il.current)sv(id,type,a);},[a,id,type]);
useEffect(()=>{(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();},[id,type]);
useEffect(()=>{(async()=>{setQs(await ldq(id,type));})();},[id,type]);
useEffect(()=>{setHighlights(ldh(id,type));},[id,type]);
useEffect(()=>{svh(id,type,highlights);},[highlights,id,type]);
if(loading)return<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
if(!user)return null;
const hsub=async()=>{if(is)return;setIs(true);const answers=qs.filter(q=>q.type==='tfng'||q.type==='single'||q.type==='multi'||q.type==='fill-in-line').map(q=>{const qn=(q as{number:number}).number;const ua=a[qn]||['—'];return{questionId:qn,userAnswer:ua,question:q};});const pl={passageId:pid,questionType:qt,userId:user.id,answers};const{ok,message}=await sub(pl);if(ok){showToast('Submission successful!');setTimeout(()=>{localStorage.removeItem(lk);r.push(`/reading/${id}/${type}/review`);},1000);}else{showToast(message,true);}setIs(false);};
const hn=(d:'back'|'next')=>{if(d==='back'){r.push('/dashboard?tab=Reading');}else{const nt=qt+1;if(nt>=1&&nt<=4)r.push(`/reading/${id}/${nt}`);}};
const handleContextMenu=(e:React.MouseEvent)=>{const selection=window.getSelection();if(!selection||selection.toString().trim()==='')return;const selectedText=selection.toString().trim();const container=e.currentTarget as HTMLElement;const{start,end}=getTextPosition(container,selection);createContextMenu(e,selectedText,start,end,()=>setHighlights(prev=>[...prev,{text:selectedText,start,end}]),()=>setHighlights(prev=>prev.filter(h=>!(start<=h.end&&end>=h.start))));};
return(<div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center"><div className="w-full max-w-6xl flex justify-start mb-4"><button onClick={()=>r.push('/dashboard')}><Home className="w-6 h-6 text-white hover:text-blue-500 transition"/></button></div><div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl"><ReadingPassage title={pt} content={pc} highlights={highlights} onContextMenu={handleContextMenu}/><QuestionList questions={qs} answers={a} setAnswers={setA}/></div><ReadingControls questionType={qt} isSubmitting={is} onSubmit={hsub} onNavigate={hn}/></div>);}