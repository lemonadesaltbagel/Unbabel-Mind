"use client";
import{useParams,useRouter}from'next/navigation';
import{useEffect,useState,useRef}from'react';
import{Home}from'lucide-react';
import{useAuth}from'@/contexts/AuthContext';
import{ld,ldp,ldq,ldh,ldFromBackend,lde}from'@/utils/reading';
import{useTestPageTitle}from'@/utils/usePageTitle';
interface Question{type:string;text?:string;number?:number;question?:string;options?:string[];correctAnswer?:string;}
export default function ReviewPage(){
useTestPageTitle();
const r=useRouter();const p=useParams();const{user,loading}=useAuth();const{id,type}=p as{id:string;type:string};const[pt,setPt]=useState('');const[pc,setPc]=useState('');const[qs,setQs]=useState<Question[]>([]);const[a,setA]=useState<Record<number,string[]>>({});const[highlights,setHighlights]=useState<Highlight[]>([]);const[showContextMenu,setShowContextMenu]=useState(false);const[contextMenuPosition,setContextMenuPosition]=useState({x:0,y:0});const contextMenuRef=useRef<HTMLDivElement>(null);const[aiResponse,setAiResponse]=useState('');const[isLoading,setIsLoading]=useState(false);const[evidence,setEvidence]=useState<{number:number;text:string}[]>([]);type Highlight={text:string;start:number;end:number;};
useEffect(()=>{if(!loading&&!user){r.push('/login');return;}},[user,loading,r]);
useEffect(()=>{(async()=>{const{title,content}=await ldp(id,type);setPt(title);setPc(content);})();(async()=>{setQs(await ldq(id,type));})();(async()=>{if(user){const backendAnswers=await ldFromBackend(Number(user.id),Number(id),Number(type));if(Object.keys(backendAnswers).length>0){setA(backendAnswers);}else{setA(ld(id,type));}}else{setA(ld(id,type));}})();setHighlights(ldh(id,type));(async()=>{setEvidence(await lde(id,type));})();},[id,type,user]);

const hn=(d:'back'|'next')=>{if(d==='back'){r.push('/dashboard?tab=Reading');}else{const ct=Number(type);const nt=ct+1;r.push(`/reading/${id}/${nt}/review`);}};
const hcm=(e:React.MouseEvent)=>{e.preventDefault();setContextMenuPosition({x:e.pageX,y:e.pageY});setShowContextMenu(true);};
const hh=()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();const r=s.getRangeAt(0);const pcr=r.cloneRange();pcr.selectNodeContents(document.querySelector('.passage-content')as Node);pcr.setEnd(r.startContainer,r.startOffset);const start=pcr.toString().length;setHighlights(prev=>[...prev,{text:st,start,end:start+st.length}]);setShowContextMenu(false);};
const hch=()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();const r=s.getRangeAt(0);const pcr=r.cloneRange();pcr.selectNodeContents(document.querySelector('.passage-content')as Node);pcr.setEnd(r.startContainer,r.startOffset);const start=pcr.toString().length;const end=start+st.length;setHighlights(prev=>prev.filter(h=>!(start<=h.end&&end>=h.start)));setShowContextMenu(false);};
const hp=async()=>{const s=window.getSelection();if(!s)return;const st=s.toString().trim();if(!st)return;setIsLoading(true);try{await new Promise(r=>setTimeout(r,1e3));setAiResponse(`You are an expert IELTS tutor helping students understand complex vocabulary. Your task is to paraphrase the selected text using simpler, more common words while maintaining the same meaning.

simplify {${st}}

Please provide a paraphrase using simpler vocabulary that a B1-B2 level English learner would understand. Focus on:
1. Using more common synonyms
2. Breaking down complex phrases
3. Maintaining the original meaning
4. Making it easier to understand
`);}catch{setAiResponse('Failed to get AI response. Please try again.');}finally{setIsLoading(false);setShowContextMenu(false);};}
const he=async(qn:number,ua:string,ca:string)=>{setIsLoading(true);try{const q=qs.find(q=>q.number===qn);if(!q)return;const qEvidence=evidence.filter(e=>e.number===qn);const prompt=`You are an expert IELTS tutor with deep knowledge of reading comprehension strategies and test-taking techniques. Your role is to help students understand their mistakes and improve their reading skills.

Question Type: ${q.type}
Question: ${q.question}
Evidence: ${qEvidence.map(e=>e.text).join('\n')}
Available Options: ${q.options?.join(', ')||'N/A'}
User Answer: ${ua}
Correct Answer: ${ca}

Please explain why the correct answer is "${ca}" and analyze why the user chose "${ua}" and what mistake they made. Provide specific guidance on how to approach similar questions in the future.`;await new Promise(resolve=>setTimeout(resolve,1000));setAiResponse(`Question ${qn} Analysis:\n\n${prompt}\n\nThis is a mock LLM prompt response from AI IELTS Assistant.`);}catch{setAiResponse('Failed to get AI explanation. Please try again.');}finally{setIsLoading(false);}};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if(loading)return<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
  if(!user)return null;

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex items-center mb-4">
        <div className="w-6">
          <button onClick={() => r.push('/dashboard')} className="text-white hover:text-blue-500 transition">
            <Home className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <h1 className="text-white text-2xl font-bold">Review: Reading Passage {type}</h1>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex w-full max-w-6xl">
        <div className="flex w-1/3 justify-end pr-2">
          <div className="w-[320px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm text-center font-semibold mb-4">
              AI IELTS Assistant
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">Loading...</div>
            ) : aiResponse ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{aiResponse}</div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">Get Started with AI for IELTS</div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-[500px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh] border-r border-gray-400">
            <h2 className="text-xl font-bold mb-2">{pt}</h2>
            <div className="whitespace-pre-wrap text-sm passage-content" onContextMenu={hcm}>
              {(() => {
                let lastIndex = 0;
                const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
                const result = [];

                sortedHighlights.forEach((highlight, index) => {
                  if (highlight.start > lastIndex) {
                    result.push(<span key={`text-${index}`}>{pc.slice(lastIndex, highlight.start)}</span>);
                  }
                  result.push(<span key={`highlight-${index}`} className="bg-yellow-200">{pc.slice(highlight.start, highlight.end)}</span>);
                  lastIndex = highlight.end;
                });

                if (lastIndex < pc.length) {
                  result.push(<span key="text-last">{pc.slice(lastIndex)}</span>);
                }

                return result;
              })()}
            </div>
            {showContextMenu && (
              <div
                ref={contextMenuRef}
                className="fixed bg-white shadow-lg rounded-md py-2 z-50"
                style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
              >
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hh}>Highlight</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hch}>Clear Highlight</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm" onClick={hp}>AI Paraphrase</button>
              </div>
            )}
          </div>

          <div className="w-[320px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Your Answers</h2>
            <ol className="space-y-4 text-sm">
              {qs.map((q, i) => {
                if (!('number' in q) || !q.number) return null;
                const userAns = a[q.number]?.[0] ?? '';
                const correct = q.correctAnswer;
                const isCorrect = userAns === correct;
                return (
                  <li key={i}>
                    <div className="mb-1 font-semibold">{q.number}. {q.question}</div>
                    <div className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      Your Answer: {userAns || '—'}
                    </div>
                    {!isCorrect && (
                      <>
                        <div className="text-blue-600">Correct Answer: {correct || 'N/A'}</div>
                        <button
                          className="mt-2 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm"
                          onClick={() => he(q.number!, userAns, correct || '')}
                        >
                          Unbabel
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Total Questions: {qs.filter(q => 'number' in q && q.number).length}</p>
                <p>Correct Answers: {qs.filter(q => 'number' in q && q.number && a[q.number]?.[0] === q.correctAnswer).length}</p>
                <p className="font-medium">
                  Score: {Math.round(
                    (qs.filter(q => 'number' in q && q.number && a[q.number]?.[0] === q.correctAnswer).length /
                    qs.filter(q => 'number' in q && q.number).length) * 100
                  )}%
                </p>
                <p className="text-xs text-gray-400 mt-4 italic">Generated by AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex justify-center mt-6 space-x-4">
        <button
          onClick={() => hn('back')}
          className="px-6 py-2 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white"
        >
          Back
        </button>
        <button
          onClick={() => hn('next')}
          disabled={type === '3'}
          className={`px-6 py-2 rounded-lg transition-colors ${
            type === '3'
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}