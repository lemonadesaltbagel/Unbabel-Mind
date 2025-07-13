'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing', 'AI Quiz'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Reading');
  const [activeOption, setActiveOption] = useState('Context Understanding');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string; submitted: boolean }>>({});

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const dummyQuestions = [
    {
      type: 'Context Understanding',
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      correct: 'Canberra'
    },
    {
      type: 'Context Understanding',
      question: 'Which word best fits the context of joy?',
      options: ['Gloomy', 'Ecstatic', 'Neutral', 'Pale'],
      correct: 'Ecstatic'
    },
    {
      type: 'English to English',
      question: 'Choose the synonym of "happy".',
      options: ['Sad', 'Joyful', 'Angry', 'Bored'],
      correct: 'Joyful'
    },
    {
      type: 'Grammar MCQ',
      question: 'Which sentence is grammatically correct?',
      options: [
        "He don't like pizza.",
        'She go to school.',
        'They are playing outside.',
        'I has a book.'
      ],
      correct: 'They are playing outside.'
    }
  ];

  const currentQuestions = dummyQuestions.filter(q => q.type === activeOption);
  const question = currentQuestions[currentQuestion];
  const answer = answers[currentQuestion] || { selected: '', submitted: false };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex">
        <aside className="fixed top-0 left-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-6">
          <button onClick={() => router.push('/dashboard')} className="mb-6">
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="mt-auto mb-4 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <span className="text-xs mt-1 text-white">Profile</span>
            <button onClick={handleLogout} className="mt-2">
              <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </aside>

        <main className="ml-16 flex-1 p-6 overflow-y-auto relative">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={handleLogout}
              className="text-sm text-white border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>

          <div className="flex space-x-6 border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-2 text-lg ${
                  activeTab === tab
                    ? 'border-b-2 border-white font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {tab === 'AI Quiz' ? (
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
                    {tab}
                  </span>
                ) : (
                  tab
                )}
              </button>
            ))}
          </div>

          {activeTab === 'AI Quiz' ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-white flex flex-col h-[70vh]">
              <div className="flex space-x-4 mb-4">
                {['Context Understanding', 'English to English', 'Grammar MCQ'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setActiveOption(opt);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}
                    className={`px-4 py-2 rounded ${
                      activeOption === opt ? 'bg-white text-black font-semibold' : 'bg-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="bg-gray-700 text-white p-4 rounded-xl mb-4 flex-1 overflow-auto">
                <p className="text-lg font-semibold mb-2">Q{currentQuestion + 1}:</p>
                <p className="text-base">{question.question}</p>
              </div>

              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {question.options.map((opt, idx) => {
                    let btnClass = 'w-full py-4 px-4 rounded text-lg text-left border';
                    if (answer.submitted) {
                      if (opt === question.correct) {
                        btnClass += ' bg-green-700 border-green-400';
                      } else if (opt === answer.selected) {
                        btnClass += ' bg-red-700 border-red-400';
                      } else {
                        btnClass += ' bg-gray-700';
                      }
                    } else if (opt === answer.selected) {
                      btnClass += ' bg-blue-700 border-blue-400';
                    } else {
                      btnClass += ' bg-gray-600';
                    }

                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => {
                          if (!answer.submitted) {
                            setAnswers(prev => ({
                              ...prev,
                              [currentQuestion]: {
                                selected: opt,
                                submitted: false
                              }
                            }));
                          }
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className={`px-4 py-2 rounded ${
                      currentQuestion === 0
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Back
                  </button>

                  {answer.submitted ? (
                    <button
                      onClick={() => {
                        if (currentQuestion < currentQuestions.length - 1) {
                          setCurrentQuestion(prev => prev + 1);
                        }
                      }}
                      className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                    >
                      Next
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setAnswers(prev => ({
                            ...prev,
                            [currentQuestion]: {
                              selected: answer.selected || '',
                              submitted: false,
                            }
                          }));
                          if (currentQuestion < currentQuestions.length - 1) {
                            setCurrentQuestion(prev => prev + 1);
                          }
                        }}
                        className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Skip
                      </button>

                      <button
                        onClick={() => {
                          if (!answer.selected) return;
                          setAnswers(prev => ({
                            ...prev,
                            [currentQuestion]: {
                              ...prev[currentQuestion],
                              submitted: true
                            }
                          }));
                        }}
                        className={`px-4 py-2 rounded ${
                          answer.selected
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                        disabled={!answer.selected}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            Array.from({ length: 20 }, (_, i) => {
              const cambridgeSet = 20 - i;
              return (
                <div key={i} className="mb-8">
                  <h2 className="text-white text-xl font-semibold mb-4">
                    IELTS Cambridge {cambridgeSet}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }, (_, j) => {
                      const testNum = j + 1;
                      return (
                        <div
                          key={testNum}
                          onClick={() =>
                            router.push(
                              `/${activeTab.toLowerCase()}/${cambridgeSet}/${testNum}`
                            )
                          }
                          className="border border-gray-600 bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
                        >
                          <div className="text-white text-lg font-medium mb-2">
                            Test {testNum}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Click to Start
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
