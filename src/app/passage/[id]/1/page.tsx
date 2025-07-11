// File: src/app/reading/[id]/[type]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';

export default function PassagePage() {
  const router = useRouter();
  const params = useParams();
  const { id, type } = params as { id: string; type: string };

  const passageId = Number(id);
  const questionType = Number(type);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [passageText, setPassageText] = useState('Loading passage...');

  const questions = [
    "1. There are other parrots that share the kākāpō’s inability to fly.",
    "2. Adult kakapo produce chicks every year.",
    "3. Adult male kakapo bring food back to nesting females.",
    "4. The Polynesian rat was a greater threat to the kakapo than Polynesian settlers.",
    "5. Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats.",
    "6. One Recovery Plan initiative that helped increase the kakapo population size was caring for struggling young birds."
  ];

  useEffect(() => {
    const loadPassage = async () => {
      try {
        const res = await fetch(`/static/passage/${id}.txt`);
        const text = await res.text();
        setPassageText(text);
      } catch (err) {
        setPassageText('Failed to load passage.');
      }
    };
    loadPassage();
  }, [id]);

  const handleSelect = (questionIndex: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    const payload = {
      passageId,
      questionType,
      userId: 123, // Replace with actual user ID
      answers: Object.entries(answers).map(([qIndex, userAnswer]) => ({
        questionId: Number(qIndex) + 1,
        userAnswer,
      })),
    };

    const res = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      alert('Submission successful!');
    } else {
      alert(result.message || 'Submission failed.');
    }
  };

  const handleNav = (direction: 'back' | 'next') => {
    const newId = direction === 'back' ? passageId - 1 : passageId + 1;
    router.push(`/reading/${newId}/${type}`);
  };

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      {/* Home Button */}
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <button onClick={() => router.push('/dashboard')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl">
        {/* Article */}
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Passage {id}</h2>
          <p className="whitespace-pre-wrap text-sm">
            {passageText}
          </p>
        </div>

        {/* Questions */}
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Questions 1 - 6</h2>
          <ol className="space-y-6">
            {questions.map((question, index) => (
              <li key={index}>
                {question}
                <div className="space-x-4 mt-2">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map(option => (
                    <label key={option} className="mr-4">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleSelect(index, option)}
                        className="mr-1"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex space-x-4 items-center">
        <button
          onClick={() => handleNav('back')}
          className={`px-4 py-2 rounded text-white ${passageId <= 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
          disabled={passageId <= 1}
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        <button
          onClick={() => handleNav('next')}
          className={`px-4 py-2 rounded text-white ${passageId >= 13 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
          disabled={passageId >= 13}
        >
          Next
        </button>
      </div>
    </div>
  );
}