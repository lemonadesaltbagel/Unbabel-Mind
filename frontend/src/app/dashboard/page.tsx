'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut, Sparkles, Zap, Target, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkTokenAndWarn } from '@/utils/tokenCheck';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing', 'AI Quiz'];

interface DynamicQuestion {
  type: string;
  question: string;
  options: string[];
  correct: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Reading');
  const [activeOption, setActiveOption] = useState('Context Understanding');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string; submitted: boolean }>>({});
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [hoveredTest, setHoveredTest] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const generateQuestionFromLLM = async (questionType: string) => {
    setIsLoadingQuestion(true);
    try {
      const hasToken = await checkTokenAndWarn();
      if (!hasToken) {
        setIsLoadingQuestion(false);
        setDynamicQuestions(prev => [...prev, {
          type: questionType,
          question: 'Please configure your OpenAI API token in your profile to use AI features.',
          options: ['Go to Profile', 'Skip for now'],
          correct: 'Go to Profile'
        }]);
        return;
      }

      const prompts = {
        'Context Understanding': 'You are an expert IELTS tutor creating context understanding questions. Background: Create a multiple choice question that tests the student\'s ability to understand context and choose the most appropriate word or phrase that fits a given situation. This should simulate real-world language use scenarios. Requirements: - Create a realistic scenario or context (business, academic, social, or everyday situations) - Provide 4 options (A, B, C, D) with clear, distinct choices - Only one option should be correct - The question should be suitable for B1-C1 level English learners - Focus on vocabulary, idioms, phrasal verbs, or contextual understanding - Include scenarios like: workplace communication, academic discussions, social interactions, or daily conversations - Make the question challenging but appropriate for the level - Ensure the incorrect options are plausible but clearly wrong in the given context Respond in JSON format only: {"question": "Your question text here","options": ["Option A", "Option B", "Option C", "Option D"],"correct": "Correct option text"}',
        'English to English': 'You are an expert IELTS tutor creating English to English vocabulary questions. Background: Create a multiple choice question that tests the student\'s knowledge of English synonyms, antonyms, or word relationships. This should help students expand their vocabulary and understand word nuances. Requirements: - Focus on vocabulary building and word relationships - Provide 4 options (A, B, C, D) with clear, distinct choices - Only one option should be correct - The question should be suitable for B1-C1 level English learners - Include topics like: synonyms, antonyms, word associations, collocations, or academic vocabulary - Focus on words commonly used in IELTS contexts (academic, formal, or everyday language) - Make the question challenging but appropriate for the level - Ensure the incorrect options are plausible but clearly wrong - The question should test understanding of word meanings and usage Respond in JSON format only: {"question": "Your question text here","options": ["Option A", "Option B", "Option C", "Option D"],"correct": "Correct option text"}',
        'Grammar MCQ': 'You are an expert IELTS tutor creating grammar multiple choice questions. Background: Create a multiple choice question that tests the student\'s understanding of English grammar rules. The question should focus on common grammar topics that IELTS students often struggle with. Requirements: - Focus on common grammar mistakes and rules that IELTS students encounter - Provide 4 options (A, B, C, D) with clear, distinct choices - Only one option should be correct - The question should be suitable for B1-C1 level English learners - Include topics like: verb tenses (present perfect, past perfect, future perfect), articles (a, an, the), prepositions, modal verbs, conditionals, passive voice, reported speech, relative clauses, or sentence structure - Make the question challenging but appropriate for the level - Ensure the incorrect options are plausible but clearly wrong - The question should test understanding, not just memorization Respond in JSON format only: {"question": "Your question text here","options": ["Option A", "Option B", "Option C", "Option D"],"correct": "Correct option text"}'
      };

      const prompt = prompts[questionType as keyof typeof prompts];
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoadingQuestion(false);
        setDynamicQuestions(prev => [...prev, {
          type: questionType,
          question: 'Please configure your OpenAI API token in your profile to use AI features.',
          options: ['Go to Profile', 'Skip for now'],
          correct: 'Go to Profile'
        }]);
        return;
      }

      const response = await fetch('/reviewaiapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        console.warn(`API request failed: ${response.status}, using fallback question`);
        const fallbackQuestions = {
          'Context Understanding': {
            question: 'In a business meeting, when someone says "Let\'s touch base next week," they mean:',
            options: ['Let\'s meet next week', 'Let\'s call each other next week', 'Let\'s send emails next week', 'Let\'s avoid each other next week'],
            correct: 'Let\'s meet next week'
          },
          'English to English': {
            question: 'Which word is a synonym for "excellent"?',
            options: ['Good', 'Outstanding', 'Average', 'Poor'],
            correct: 'Outstanding'
          },
          'Grammar MCQ': {
            question: 'Choose the correct form: "She _____ to the store yesterday."',
            options: ['go', 'goes', 'went', 'gone'],
            correct: 'went'
          }
        };

        const fallback = fallbackQuestions[questionType as keyof typeof fallbackQuestions] || {
          question: 'What is the capital of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
          correct: 'Canberra'
        };

        const newQuestion: DynamicQuestion = {
          type: questionType,
          question: fallback.question,
          options: fallback.options,
          correct: fallback.correct
        };
        setDynamicQuestions(prev => [...prev, newQuestion]);
        setIsLoadingQuestion(false);
        return;
      }

      const data = await response.json();
      const generatedText = data.generated_text || '';

      if (!generatedText) {
        console.warn('No response from LLM, using fallback question');
        const fallbackQuestions = {
          'Context Understanding': {
            question: 'In a business meeting, when someone says "Let\'s touch base next week," they mean:',
            options: ['Let\'s meet next week', 'Let\'s call each other next week', 'Let\'s send emails next week', 'Let\'s avoid each other next week'],
            correct: 'Let\'s meet next week'
          },
          'English to English': {
            question: 'Which word is a synonym for "excellent"?',
            options: ['Good', 'Outstanding', 'Average', 'Poor'],
            correct: 'Outstanding'
          },
          'Grammar MCQ': {
            question: 'Choose the correct form: "She _____ to the store yesterday."',
            options: ['go', 'goes', 'went', 'gone'],
            correct: 'went'
          }
        };

        const fallback = fallbackQuestions[questionType as keyof typeof fallbackQuestions] || {
          question: 'What is the capital of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
          correct: 'Canberra'
        };

        const newQuestion: DynamicQuestion = {
          type: questionType,
          question: fallback.question,
          options: fallback.options,
          correct: fallback.correct
        };
        setDynamicQuestions(prev => [...prev, newQuestion]);
        setIsLoadingQuestion(false);
        return;
      }

      let jsonText = generatedText.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1]?.split('```')[0] || jsonText;
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1] || jsonText;
      }

      try {
        const parsedQuestion = JSON.parse(jsonText);
        if (parsedQuestion.question && parsedQuestion.options && parsedQuestion.correct) {
          const newQuestion: DynamicQuestion = {
            type: questionType,
            question: parsedQuestion.question,
            options: parsedQuestion.options,
            correct: parsedQuestion.correct
          };
          setDynamicQuestions(prev => [...prev, newQuestion]);
        } else {
          throw new Error('Invalid question format - missing required fields');
        }
      } catch (parseError) {
        console.error('Failed to parse LLM response:', parseError);
        console.error('Raw response:', generatedText);
        const fallbackQuestions = {
          'Context Understanding': {
            question: 'In a business meeting, when someone says "Let\'s touch base next week," they mean:',
            options: ['Let\'s meet next week', 'Let\'s call each other next week', 'Let\'s send emails next week', 'Let\'s avoid each other next week'],
            correct: 'Let\'s meet next week'
          },
          'English to English': {
            question: 'Which word is a synonym for "excellent"?',
            options: ['Good', 'Outstanding', 'Average', 'Poor'],
            correct: 'Outstanding'
          },
          'Grammar MCQ': {
            question: 'Choose the correct form: "She _____ to the store yesterday."',
            options: ['go', 'goes', 'went', 'gone'],
            correct: 'went'
          }
        };

        const fallback = fallbackQuestions[questionType as keyof typeof fallbackQuestions] || {
          question: 'What is the capital of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
          correct: 'Canberra'
        };

        const newQuestion: DynamicQuestion = {
          type: questionType,
          question: fallback.question,
          options: fallback.options,
          correct: fallback.correct
        };
        setDynamicQuestions(prev => [...prev, newQuestion]);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      const fallbackQuestions = {
        'Context Understanding': {
          question: 'In a business meeting, when someone says "Let\'s touch base next week," they mean:',
          options: ['Let\'s meet next week', 'Let\'s call each other next week', 'Let\'s send emails next week', 'Let\'s avoid each other next week'],
          correct: 'Let\'s meet next week'
        },
        'English to English': {
          question: 'Which word is a synonym for "excellent"?',
          options: ['Good', 'Outstanding', 'Average', 'Poor'],
          correct: 'Outstanding'
        },
        'Grammar MCQ': {
          question: 'Choose the correct form: "She _____ to the store yesterday."',
          options: ['go', 'goes', 'went', 'gone'],
          correct: 'went'
        }
      };

      const fallback = fallbackQuestions[questionType as keyof typeof fallbackQuestions] || {
        question: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correct: 'Canberra'
      };

      const newQuestion: DynamicQuestion = {
        type: questionType,
        question: fallback.question,
        options: fallback.options,
        correct: fallback.correct
      };
      setDynamicQuestions(prev => [...prev, newQuestion]);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleOptionChange = (option: string) => {
    setActiveOption(option);
    setCurrentQuestion(0);
    setAnswers({});
    setDynamicQuestions([]);
    if (option !== 'AI Quiz') return;
    generateQuestionFromLLM(option);
  };

  useEffect(() => {
    if (activeTab === 'AI Quiz' && dynamicQuestions.length === 0) {
      generateQuestionFromLLM(activeOption);
    }
  }, [activeTab, activeOption, dynamicQuestions.length]);

  const currentQuestions = dynamicQuestions.filter(q => q.type === activeOption);
  const question = currentQuestions[currentQuestion];
  const answer = answers[currentQuestion] || { selected: '', submitted: false };

  const handleAnswer = (selected: string) => {
    if (selected === 'Go to Profile') {
      router.push('/profile');
    } else if (selected === 'Skip for now') {
      if (currentQuestion < currentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion]: { selected, submitted: false } }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#15202B] text-white flex relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
        ></div>

        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-20 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 z-50">
          <button onClick={() => router.push('/dashboard')} className="mb-8 group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <Home className="w-7 h-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-200" />
          </button>
          
          <div className="mt-auto mb-6 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => router.push(`/profile?tab=${activeTab}`)}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold relative z-10 group-hover:scale-110 transition-transform duration-200">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            </div>
            <span 
              className="text-xs mt-2 text-white/80 cursor-pointer hover:text-white transition-colors" 
              onClick={() => router.push(`/profile?tab=${activeTab}`)}
            >
              Profile
            </span>
            <button onClick={handleLogout} className="mt-3 group">
              <div className="absolute inset-0 bg-red-500/20 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 relative z-10 group-hover:scale-110 transition-all duration-200" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-20 flex-1 p-8 overflow-y-auto relative">
          <div className="absolute top-0 right-0 p-6">
            <button 
              onClick={handleLogout} 
              className="text-sm text-white/90 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-white/10 mb-8 pb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative pb-3 text-lg font-medium transition-all duration-300 ${
                  activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
              >
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
                {hoveredTab === tab && activeTab !== tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full animate-pulse"></div>
                )}
                {tab === 'AI Quiz' ? (
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    {tab}
                  </span>
                ) : tab}
              </button>
            ))}
          </div>

          {/* AI Quiz Content */}
          {activeTab === 'AI Quiz' ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto text-white flex flex-col h-[75vh] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
              <div className="relative z-10">
                {/* Option Selection */}
                <div className="flex space-x-4 mb-6">
                  {['Context Understanding', 'English to English', 'Grammar MCQ'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleOptionChange(opt)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                        activeOption === opt
                          ? 'bg-gradient-to-r from-white to-gray-100 text-black shadow-lg scale-105'
                          : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      {activeOption === opt && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                      )}
                      <span className="relative z-10">{opt}</span>
                    </button>
                  ))}
                </div>

                {/* Question Display */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl mb-6 flex-1 overflow-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <p className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-blue-400" />
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Q{currentQuestion + 1}:
                      </span>
                    </p>
                    
                    {isLoadingQuestion ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
                          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 bg-blue-500/20"></div>
                        </div>
                        <span className="ml-4 text-lg font-medium">Generating AI question...</span>
                      </div>
                    ) : question ? (
                      <p className="text-lg leading-relaxed">{question.question}</p>
                    ) : (
                      <p className="text-lg text-white/60">No questions available</p>
                    )}
                  </div>
                </div>

                {/* Answer Options and Navigation */}
                <div className="mt-4">
                  {question && !isLoadingQuestion && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {question.options.map((option, idx) => {
                          let buttonClass = 'w-full py-5 px-6 rounded-xl text-lg text-left border transition-all duration-300 relative overflow-hidden group';
                          
                          if (answer.submitted) {
                            if (option === question.correct) {
                              buttonClass += ' bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/50 shadow-lg shadow-green-500/25';
                            } else if (option === answer.selected) {
                              buttonClass += ' bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-400/50 shadow-lg shadow-red-500/25';
                            } else {
                              buttonClass += ' bg-white/5 border-white/10';
                            }
                          } else if (option === answer.selected) {
                            buttonClass += ' bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/50 shadow-lg shadow-blue-500/25';
                          } else {
                            buttonClass += ' bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105';
                          }

                          return (
                            <button
                              key={idx}
                              className={buttonClass}
                              onClick={() => {
                                if (!answer.submitted) handleAnswer(option);
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative z-10">{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between">
                        <button
                          disabled={currentQuestion === 0}
                          onClick={() => setCurrentQuestion(prev => prev - 1)}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            currentQuestion === 0
                              ? 'bg-white/5 text-white/40 cursor-not-allowed'
                              : 'bg-white/10 hover:bg-white/20 text-white hover:scale-105'
                          }`}
                        >
                          ← Back
                        </button>

                        {answer.submitted ? (
                          <button
                            onClick={() => {
                              if (currentQuestion < currentQuestions.length - 1) {
                                setCurrentQuestion(prev => prev + 1);
                              } else {
                                generateQuestionFromLLM(activeOption);
                                setCurrentQuestion(prev => prev + 1);
                              }
                            }}
                            className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          >
                            Next <Zap className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                if (currentQuestion < currentQuestions.length - 1) {
                                  setCurrentQuestion(prev => prev + 1);
                                }
                              }}
                              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              Skip
                            </button>
                            <button
                              onClick={() => {
                                if (!answer.selected) return;
                                setAnswers(prev => ({
                                  ...prev,
                                  [currentQuestion]: { ...prev[currentQuestion], submitted: true }
                                }));
                              }}
                              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                answer.selected
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:scale-105'
                                  : 'bg-white/5 text-white/40 cursor-not-allowed'
                              }`}
                              disabled={!answer.selected}
                            >
                              <Brain className="w-4 h-4" /> Submit
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Test Grid for Other Tabs */
            Array.from({ length: 20 }, (_, i) => {
              const cambridgeSeries = 20 - i;
              return (
                <div key={i} className="mb-10">
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      IELTS Cambridge {cambridgeSeries}
                    </span>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }, (_, j) => {
                      const testNumber = j + 1;
                      const testId = `${cambridgeSeries}-${testNumber}`;
                      return (
                        <div
                          key={testNumber}
                          onClick={() => router.push(`/${activeTab.toLowerCase()}/${cambridgeSeries}/${testNumber}`)}
                          onMouseEnter={() => setHoveredTest(testId)}
                          onMouseLeave={() => setHoveredTest(null)}
                          className={`border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                            hoveredTest === testId
                              ? 'scale-105 shadow-2xl shadow-blue-500/25'
                              : 'hover:scale-105 hover:shadow-lg'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10">
                            <div className="text-white text-xl font-bold mb-3 flex items-center gap-2">
                              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Test {testNumber}
                              </span>
                              {hoveredTest === testId && (
                                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                              )}
                            </div>
                            <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                              Click to Start
                            </div>
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
