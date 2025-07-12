'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Save } from 'lucide-react';
export default function WritingPage() {
  const r = useRouter();
  const p = useParams();
  const { id, type } = p as { id: string; type: string };
  const pid = Number(id);
  const qt = Number(type);
  const lk = `writing-answers-${id}-${type}`;
  const [pt, setPt] = useState('');
  const [pc, setPc] = useState('Loading writing prompt...');
  const [is, setIs] = useState(false);
  const [essay, setEssay] = useState('');
  useEffect(() => {
    const lp = async () => {
      try {
        const res = await fetch(`/static/writing/${id}_${type}.txt`);
        const text = await res.text();
        const [tl, ...rest] = text.split('\n');
        setPt(tl.trim());
        setPc(rest.join('\n').trim());
      } catch {
        setPt('');
        setPc('Failed to load writing prompt.');
      }
    };
    lp();
  }, [id, type]);
  const hsub = async () => {
    if (is) return;
    setIs(true);
    const pl = {
      passageId: pid,
      questionType: qt,
      userId: 123,
      essay: essay,
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
      r.push(`/writing/${id}/${nt}`);
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
          <h2 className="text-xl font-bold mb-2">Writing Section {type}</h2>
          <h3 className="text-md font-semibold mb-4">{pt}</h3>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <div className="text-center text-yellow-600 mb-2">✍️ Writing Task</div>
            <div className="text-sm text-gray-600 mb-2">Write your response in the editor on the right.</div>
            <div className="text-xs text-gray-500">Word count: {essay.split(' ').filter(word => word.length > 0).length}/250</div>
          </div>
          <p className="whitespace-pre-wrap text-sm">{pc}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Essay Editor</h2>
            <button className="flex items-center space-x-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
              <Save className="w-4 h-4" />
              <span>Auto-save</span>
            </button>
          </div>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Start writing your essay here..."
            className="w-full h-[60vh] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 text-sm text-gray-500">
            <div>Words: {essay.split(' ').filter(word => word.length > 0).length}</div>
            <div>Characters: {essay.length}</div>
          </div>
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