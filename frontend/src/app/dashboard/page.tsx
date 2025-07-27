'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const generateQuestionsFromLLM = async (questionType: string) => {
    setIsLoadingQuestions(true);
    try {
      const prompts = {
        'Context Understanding': `You are an expert IELTS tutor creating context understanding questions.

Background: Create a multiple choice question that tests the student's ability to understand context and choose the most appropriate word or phrase that fits a given situation. This should simulate real-world language use scenarios.

Requirements:
- Create a realistic scenario or context (business, academic, social, or everyday situations)
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Focus on vocabulary, idioms, phrasal verbs, or contextual understanding
- Include scenarios like: workplace communication, academic discussions, social interactions, or daily conversations
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong in the given context

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`,
        'English to English': `You are an expert IELTS tutor creating English to English vocabulary questions.

Background: Create a multiple choice question that tests the student's knowledge of English synonyms, antonyms, or word relationships. This should help students expand their vocabulary and understand word nuances.

Requirements:
- Focus on vocabulary building and word relationships
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Include topics like: synonyms, antonyms, word associations, collocations, or academic vocabulary
- Focus on words commonly used in IELTS contexts (academic, formal, or everyday language)
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong
- The question should test understanding of word meanings and usage

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`,
        'Grammar MCQ': `You are an expert IELTS tutor creating grammar multiple choice questions.

Background: Create a multiple choice question that tests the student's understanding of English grammar rules. The question should focus on common grammar topics that IELTS students often struggle with.

Requirements:
- Focus on common grammar mistakes and rules that IELTS students encounter
- Provide 4 options (A, B, C, D) with clear, distinct choices
- Only one option should be correct
- The question should be suitable for B1-C1 level English learners
- Include topics like: verb tenses (present perfect, past perfect, future perfect), articles (a, an, the), prepositions, modal verbs, conditionals, passive voice, reported speech, relative clauses, or sentence structure
- Make the question challenging but appropriate for the level
- Ensure the incorrect options are plausible but clearly wrong
- The question should test understanding, not just memorization

Respond in JSON format only:
{
  "question": "Your question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Correct option text"
}`
      };

      const prompt = prompts[questionType as keyof typeof prompts];
      
      const response = await fetch('/api/reviewaiapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.generated_text || data[0]?.generated_text || '';
      
      if (!generatedText) {
        throw new Error('No response from LLM');
      }

      // Clean the response text to extract JSON
      let jsonText = generatedText.trim();
      
      // Try to extract JSON from the response if it's wrapped in markdown
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
        
        // Generate a more appropriate fallback question based on the type
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
        
        const fallbackQuestion: DynamicQuestion = {
          type: questionType,
          question: fallback.question,
          options: fallback.options,
          correct: fallback.correct
        };
        setDynamicQuestions(prev => [...prev, fallbackQuestion]);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      
      // Generate a more appropriate fallback question based on the type
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
      
      const fallbackQuestion: DynamicQuestion = {
        type: questionType,
        question: fallback.question,
        options: fallback.options,
        correct: fallback.correct
      };
      setDynamicQuestions(prev => [...prev, fallbackQuestion]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleOptionChange = (option: string) => {
    setActiveOption(option);
    setCurrentQuestion(0);
    setAnswers({});
    setDynamicQuestions([]);
    // Generate a new question for the selected option
    generateQuestionsFromLLM(option);
  };

  // Generate initial question when AI Quiz is first accessed
  useEffect(() => {
    if (activeTab === 'AI Quiz' && dynamicQuestions.length === 0) {
      generateQuestionsFromLLM(activeOption);
    }
  }, [activeTab, activeOption]);

  const currentQuestions = dynamicQuestions.filter(q => q.type === activeOption);
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
            <div
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
                onClick={() => router.push('/profile')}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs mt-1 text-white cursor-pointer" onClick={() => router.push('/profile')}>
                Profile
              </span>
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
                    onClick={() => handleOptionChange(opt)}
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
                {isLoadingQuestions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3">Generating question...</span>
                  </div>
                ) : question ? (
                  <p className="text-base">{question.question}</p>
                ) : (
                  <p className="text-base text-gray-400">No questions available</p>
                )}
              </div>

              <div className="mt-2">
                {question && !isLoadingQuestions && (
                  <>
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
                            } else {
                              // Generate a new question if we're at the end
                              generateQuestionsFromLLM(activeOption);
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
                  </>
                )}
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
