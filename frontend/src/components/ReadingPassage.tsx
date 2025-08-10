import{Highlight}from'@/types/reading';
type Props={title:string;content:string;highlights:Highlight[];onContextMenu:(e:React.MouseEvent)=>void;};
export default function ReadingPassage({title,content,highlights,onContextMenu}:Props){
const rht=(pc:string,h:Highlight[])=>{
let li=0;const sh=[...h].sort((a,b)=>a.start-b.start);const r:React.ReactElement[]=[];
sh.forEach((h,i)=>{if(h.start>li)r.push(<span key={`text-${i}`}>{pc.slice(li,h.start)}</span>);r.push(<span key={`highlight-${i}`} className="bg-yellow-200">{pc.slice(h.start,h.end)}</span>);li=h.end;});if(li<pc.length)r.push(<span key="text-last">{pc.slice(li)}</span>);return r;};
return(<div className="bg-white p-6 rounded-xl shadow w-full lg:w-3/5 h-[80vh] overflow-y-auto"><h2 className="text-xl font-bold mb-2">Reading Section</h2><h3 className="text-md font-semibold mb-4">{title}</h3><p className="whitespace-pre-wrap text-sm" onContextMenu={onContextMenu}>{rht(content,highlights)}</p></div>);} 