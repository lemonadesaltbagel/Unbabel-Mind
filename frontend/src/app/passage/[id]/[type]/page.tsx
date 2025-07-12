'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';

type Question =
  | { type: 'intro'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'tfng' | 'single' | 'multi'; number: number; question: string; options: string[] }
  | { type: 'fill-in-line'; number: number; text: string };

export default function PassagePage() {
  const router = useRouter();
  const params = useParams();
  const { id, type } = params as { id: string; type: string };

  const passageId = Number(id);
  const questionType = Number(type);
  const localKey = `answers-${id}-${type}`;

  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('Loading passage...');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialLoad = useRef(true);

  // ✅ 加载本页缓存答案
  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      setAnswers(JSON.parse(saved));
    } else {
      setAnswers({});
    }
    initialLoad.current = true;
  }, [localKey]);

  // ✅ 缓存本页答案
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      localStorage.setItem(localKey, JSON.stringify(answers));
    }
  }, [answers, localKey]);

  // ✅ 加载文章内容
  useEffect(() => {
    const loadPassage = async () => {
      try {
        const res = await fetch(`/static/passage/${id}_${type}.txt`);
        const text = await res.text();
        const [titleLine, ...rest] = text.split('\n');
        setPassageTitle(titleLine.trim());
        setPassageContent(rest.join('\n').trim());
      } catch {
        setPassageTitle('');
        setPassageContent('Failed to load passage.');
      }
    };
    loadPassage();
  }, [id, type]);

  // ✅ 加载题目数据
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch(`/static/passage/${id}_${type}_q.json`);
        const data = await res.json();
        setQuestions(data);
      } catch {
        setQuestions([{ type: 'intro', text: 'Failed to load questions.' }]);
      }
    };
    loadQuestions();
  }, [id, type]);

  const handleSelect = (number: number, option: string, isMulti: boolean) => {
    setAnswers(prev => {
      const prevAns = prev[number] || [];
      const updated = isMulti
        ? prevAns.includes(option)
          ? prevAns.filter(o => o !== option)
          : [...prevAns, option]
        : [option];
      return { ...prev, [number]: updated };
    });
  };

  const handleFillBlank = (number: number, value: string) => {
    setAnswers(prev => ({ ...prev, [number]: [value] }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      passageId,
      questionType,
      userId: 123,
      answers: Object.entries(answers).map(([qIndex, userAnswer]) => ({
        questionId: Number(qIndex),
        userAnswer,
      })),
    };

    try {
      const res = await fetch('/api/submitAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Submission successful!');
        localStorage.removeItem(localKey);
        router.push('/dashboard');
      } else {
        alert(result.message || 'Submission failed.');
      }
    } catch {
      alert('Network error.');
    }

    setIsSubmitting(false);
  };

  const handleNav = (direction: 'back' | 'next') => {
    const newType = direction === 'back' ? questionType - 1 : questionType + 1;
    if (newType >= 1 && newType <= 4) {
      router.push(`/passage/${id}/${newType}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <button onClick={() => router.push('/dashboard')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Passage {type}</h2>
          <h3 className="text-md font-semibold mb-4">{passageTitle}</h3>
          <p className="whitespace-pre-wrap text-sm">{passageContent}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          <ol className="space-y-6 text-sm">
            {questions.map((q, index) => {
              if (q.type === 'intro') {
                return (
                  <div key={`intro-${index}`} className="text-base font-semibold mb-3 whitespace-pre-line">
                    {q.text}
                  </div>
                );
              }

              if (q.type === 'subheading') {
                return (
                  <div key={`subheading-${index}`} className="font-semibold mb-2">
                    {q.text}
                  </div>
                );
              }

              if (q.type === 'fill-in-line') {
                return (
                  <li key={`fill-${q.number}`}>
                    <div className="mb-2">
                      {q.text.split('____').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <input
                              type="text"
                              className="inline-block w-40 border border-gray-400 rounded px-2 py-1 mx-1"
                              value={answers[q.number]?.[0] || ''}
                              placeholder={`${q.number}`}
                              onChange={e => handleFillBlank(q.number, e.target.value)}
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
                    {q.options.map(option => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type={q.type === 'multi' ? 'checkbox' : 'radio'}
                          name={`q-${q.number}`}
                          value={option}
                          checked={answers[q.number]?.includes(option) || false}
                          onChange={() =>
                            handleSelect(q.number, option, q.type === 'multi')
                          }
                          className="mr-2"
                        />
                        {option}
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
          onClick={() => handleNav('back')}
          className={`px-4 py-2 rounded text-white ${
            questionType <= 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          disabled={questionType <= 1}
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded text-white ${
            isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        <button
          onClick={() => handleNav('next')}
          className={`px-4 py-2 rounded text-white ${
            questionType >= 4 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          disabled={questionType >= 4}
        >
          Next
        </button>
      </div>
    </div>
  );
}