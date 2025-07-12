'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
type Q = { type: 'intro'; text: string } | { type: 'subheading'; text: string } | { type: 'tfng' | 'single' | 'multi'; number: number; question: string; options: string[] } | { type: 'fill-in-line'; number: number; text: string };
export default function PassagePage() {
  const r = useRouter();
  const p = useParams();
  const { id, type } = p as { id: string; type: string };
  const pid = Number(id);
  const qt = Number(type);
  const lk = `answers-${id}-${type}`;
  const [pt, setPt] = useState('');
  const [pc, setPc] = useState('Loading passage...');
  const [qs, setQs] = useState<Q[]>([]);
  const [a, setA] = useState<Record<number, string[]>>({});
  const [is, setIs] = useState(false);
  const il = useRef(true);
  useEffect(() => {
    const s = localStorage.getItem(lk);
    if (s) {
      setA(JSON.parse(s));
    } else {
      setA({});
    }
    il.current = true;
  }, [lk]);
  useEffect(() => {
    if (il.current) {
      il.current = false;
    } else {
      localStorage.setItem(lk, JSON.stringify(a));
    }
  }, [a, lk]);
  useEffect(() => {
    const lp = async () => {
      try {
        const res = await fetch(`/static/passage/${id}_${type}.txt`);
        const text = await res.text();
        const [tl, ...rest] = text.split('\n');
        setPt(tl.trim());
        setPc(rest.join('\n').trim());
      } catch {
        setPt('');
        setPc('Failed to load passage.');
      }
    };
    lp();
  }, [id, type]);
  useEffect(() => {
    const lq = async () => {
      try {
        const res = await fetch(`/static/passage/${id}_${type}_q.json`);
        const data = await res.json();
        setQs(data);
      } catch {
        setQs([{ type: 'intro', text: 'Failed to load questions.' }]);
      }
    };
    lq();
  }, [id, type]);
  const hs = (n: number, o: string, m: boolean) => {
    setA(prev => {
      const pa = prev[n] || [];
      const u = m ? pa.includes(o) ? pa.filter(x => x !== o) : [...pa, o] : [o];
      return { ...prev, [n]: u };
    });
  };
  const hf = (n: number, v: string) => {
    setA(prev => ({ ...prev, [n]: [v] }));
  };
  const hsub = async () => {
    if (is) return;
    setIs(true);
    const pl = {
      passageId: pid,
      questionType: qt,
      userId: 123,
      answers: Object.entries(a).map(([qi, ua]) => ({
        questionId: Number(qi),
        userAnswer: ua,
      })),
    };
    try {
      const res = await fetch('/api/submitAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pl),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Submission successful!');
        localStorage.removeItem(lk);
        r.push('/dashboard');
      } else {
        alert(result.message || 'Submission failed.');
      }
    } catch {
      alert('Network error.');
    }
    setIs(false);
  };
  const hn = (d: 'back' | 'next') => {
    const nt = d === 'back' ? qt - 1 : qt + 1;
    if (nt >= 1 && nt <= 4) {
      r.push(`/passage/${id}/${nt}`);
    }
  };
  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <button onClick={() => r.push('/dashboard')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
      </div>
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Passage {type}</h2>
          <h3 className="text-md font-semibold mb-4">{pt}</h3>
          <p className="whitespace-pre-wrap text-sm">{pc}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          <ol className="space-y-6 text-sm">
            {qs.map((q, i) => {
              if (q.type === 'intro') {
                return (
                  <div key={`intro-${i}`} className="text-base font-semibold mb-3 whitespace-pre-line">
                    {q.text}
                  </div>
                );
              }
              if (q.type === 'subheading') {
                return (
                  <div key={`subheading-${i}`} className="font-semibold mb-2">
                    {q.text}
                  </div>
                );
              }
              if (q.type === 'fill-in-line') {
                return (
                  <li key={`fill-${q.number}`}>
                    <div className="mb-2">
                      {q.text.split('____').map((part, j, arr) => (
                        <span key={j}>
                          {part}
                          {j < arr.length - 1 && (
                            <input
                              type="text"
                              className="inline-block w-40 border border-gray-400 rounded px-2 py-1 mx-1"
                              value={a[q.number]?.[0] || ''}
                              placeholder={`${q.number}`}
                              onChange={e => hf(q.number, e.target.value)}
                            />
                          )}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              }
              return (
                <li key={`q-${q.number}`}>
                  <div className="mb-2">{q.number}. {q.question}</div>
                  <div className="flex flex-wrap gap-4">
                    {q.options.map(o => (
                      <label key={o} className="flex items-center gap-2">
                        <input
                          type={q.type === 'multi' ? 'checkbox' : 'radio'}
                          name={`q-${q.number}`}
                          value={o}
                          checked={a[q.number]?.includes(o) || false}
                          onChange={() => hs(q.number, o, q.type === 'multi')}
                          className="mr-2"
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div className="mt-8 flex space-x-4 items-center">
        <button
          onClick={() => hn('back')}
          className={`px-4 py-2 rounded text-white ${
            qt <= 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          disabled={qt <= 1}
        >
          Back
        </button>
        <button
          onClick={hsub}
          disabled={is}
          className={`px-6 py-2 rounded text-white ${
            is ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {is ? 'Submitting...' : 'Submit'}
        </button>
        <button
          onClick={() => hn('next')}
          className={`px-4 py-2 rounded text-white ${
            qt >= 4 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          disabled={qt >= 4}
        >
          Next
        </button>
      </div>
    </div>
  );
}