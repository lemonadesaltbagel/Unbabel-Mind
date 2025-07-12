'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { passageAPI } from '@/utils/api';
import type { Passage } from '@/types';
export default function PassagePage({ params }: { params: { id: string } }) {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const data = await passageAPI.getById(params.id);
        setPassage(data);
      } catch (error) {
        console.error('Failed to fetch passage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPassage();
  }, [params.id]);
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };
  const handleSubmit = async () => {
    if (!passage) return;
    try {
      const result = await passageAPI.submitAnswer(params.id, { answers });
      setScore(result.score);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit answers:', error);
    }
  };
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Loading passage...</div>
        </div>
      </ProtectedRoute>
    );
  }
  if (!passage) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Passage not found</div>
        </div>
      </ProtectedRoute>
    );
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-8">{passage.title}</h1>
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {passage.content}
            </div>
          </div>
          {!submitted ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Questions</h2>
              {passage.questions.map((question, index) => (
                <div key={question.id} className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    {index + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={answers[question.id] === optionIndex}
                          onChange={() => handleAnswerChange(question.id, optionIndex)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Results</h2>
              <p className="text-xl">
                Your score: <span className="text-green-400 font-bold">{score}%</span>
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}