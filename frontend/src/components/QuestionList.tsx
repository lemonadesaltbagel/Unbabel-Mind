import{Question,Answers,Highlight}from'@/types/reading';
import{hs,hf}from'@/utils/reading';
import{createContextMenu}from'@/utils/contextMenu';
type Props={questions:Question[];answers:Answers;setAnswers:(a:Answers)=>void;highlights?:Highlight[];setHighlights?:(h:Highlight[]|((prev:Highlight[])=>Highlight[]))=>void;};
export default function QuestionList({questions,answers,setAnswers,highlights=[],setHighlights}:Props){
const hsa=(n:number,o:string,m:boolean)=>setAnswers(hs(n,o,m,answers));
const hfa=(n:number,v:string)=>setAnswers(hf(n,v,answers));
const rht=(text:string,h:Highlight[],textId:string)=>{
if(!h||h.length===0)return[<span key="text">{text}</span>];
let li=0;const sh=h.filter(hl=>hl.textId===textId).sort((a,b)=>a.start-b.start);const r:React.ReactElement[]=[];
sh.forEach((h,i)=>{if(h.start>li)r.push(<span key={`text-${i}`}>{text.slice(li,h.start)}</span>);r.push(<span key={`highlight-${i}`} className="bg-yellow-200">{text.slice(h.start,h.end)}</span>);li=h.end;});if(li<text.length)r.push(<span key="text-last">{text.slice(li)}</span>);return r;};
const handleContextMenu=(e:React.MouseEvent,text:string,textId:string)=>{
if(!setHighlights)return;
const selection=window.getSelection();if(!selection||selection.toString().trim()==='')return;
const selectedText=selection.toString().trim();const target=e.currentTarget as HTMLElement;
const range=selection.getRangeAt(0);const preCaretRange=range.cloneRange();
preCaretRange.selectNodeContents(target);preCaretRange.setEnd(range.startContainer,range.startOffset);
const start=preCaretRange.toString().length;const end=start+selection.toString().length;
createContextMenu(e,selectedText,start,end,()=>setHighlights(prev=>[...prev,{text:selectedText,start,end,textId}]),()=>setHighlights(prev=>prev.filter(h=>!(h.textId===textId&&start<=h.end&&end>=h.start))));};
return(<div className="bg-white p-6 rounded-xl shadow w-full lg:w-2/5 h-[80vh] overflow-y-auto"><h2 className="text-xl font-bold mb-4">Questions</h2><ol className="space-y-6 text-sm">{questions.map((q,i)=>{if(q.type==='intro')return<div key={`intro-${i}`} className="text-base font-semibold mb-3 whitespace-pre-line" onContextMenu={setHighlights?e=>handleContextMenu(e,q.text,`intro-${i}`):undefined}>{rht(q.text,highlights,`intro-${i}`)}</div>;if(q.type==='subheading')return<div key={`subheading-${i}`} className="font-semibold mb-2" onContextMenu={setHighlights?e=>handleContextMenu(e,q.text,`subheading-${i}`):undefined}>{rht(q.text,highlights,`subheading-${i}`)}</div>;if(q.type==='fill-in-line')return(<li key={`fill-${q.number}`}><div className="mb-2">{q.text.split('____').map((part,j,arr)=>(<span key={j} onContextMenu={setHighlights?e=>handleContextMenu(e,part,`fill-${q.number}-${j}`):undefined}>{rht(part,highlights,`fill-${q.number}-${j}`)}{j<arr.length-1&&<input type="text" className="inline-block w-40 border border-gray-400 rounded px-2 py-1 mx-1" value={answers[q.number]?.[0]||''} placeholder="—" onChange={e=>hfa(q.number,e.target.value)}/>}</span>))}</div></li>);return(<li key={`q-${q.number}`}><div className="mb-2">{q.number}. <span onContextMenu={setHighlights?e=>handleContextMenu(e,q.question,`q-${q.number}`):undefined}>{rht(q.question,highlights,`q-${q.number}`)}</span></div><div className="flex flex-wrap gap-4">{q.options.map((o,j)=>(<label key={o} className="flex items-center gap-2"><input type={q.type==='multi'?'checkbox':'radio'} name={`q-${q.number}`} value={o} checked={answers[q.number]?.includes(o)||false} onChange={()=>hsa(q.number,o,q.type==='multi')} className="mr-2"/><span onContextMenu={setHighlights?e=>handleContextMenu(e,o,`o-${q.number}-${j}`):undefined}>{rht(o,highlights,`o-${q.number}-${j}`)}</span></label>))}</div></li>);})}</ol></div>);} 