'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LogOut, Sparkles, Zap, Target, Brain, Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkTokenAndWarn } from '@/utils/tokenCheck';

const tabs = ['Reading', 'Listening', 'Speaking', 'Writing', 'AI Quiz'];

const quickStats = [
  {
    label: 'Focus minutes today',
    value: '48',
    meta: '+12 vs avg',
    icon: Clock
  },
  {
    label: 'Band momentum',
    value: '+0.4',
    meta: 'Tracking 7.5',
    icon: Activity
  },
  {
    label: 'Sets cleared',
    value: '32',
    meta: '90 day streak',
    icon: Sparkles
  }
] as const;

const practiceFeed = [
  {
    title: 'Reading set 09',
    detail: 'Accuracy bumped 6% after note review',
    time: '2m ago'
  },
  {
    title: 'Speaking drill',
    detail: 'Fluency stabilized at 7.1 band',
    time: '26m ago'
  },
  {
    title: 'Writing Task 2',
    detail: 'Draft saved · Lexical upgrade issued',
    time: '1h ago'
  }
];

const skillInsights: Record<string, { title: string; cues: string[] }> = {
  Reading: {
    title: 'Reading cues',
    cues: [
      'Mark absolutes before checking T/F/NG logic.',
      'Underline paragraph topics in the left margin.',
      'Decide on keyword synonyms before scanning the passage.'
    ]
  },
  Listening: {
    title: 'Listening cues',
    cues: [
      'Replay clauses, not full recordings, when unsure.',
      'Note numbers + names immediately—they rarely repeat.',
      'Highlight tone shifts; they usually flip the answer.'
    ]
  },
  Speaking: {
    title: 'Speaking cues',
    cues: [
      'Use a hook sentence, then dive into detail quickly.',
      'Swap filler words for 1-2 second reflective pauses.',
      'Close with a reflective line to signal structure.'
    ]
  },
  Writing: {
    title: 'Writing cues',
    cues: [
      'Lock your stance in the first 40 words.',
      'Use one high-precision adjective per paragraph.',
      'Mirror the task prompt verbs to stay on topic.'
    ]
  },
  'AI Quiz': {
    title: 'AI drill cues',
    cues: [
      'Let AI warm you up, then jump into Cambridge sets.',
      'Tag wrong answers so the system reruns variants.',
      'Jump to Profile to plug in your API key if needed.'
    ]
  }
};

const stageNotes: Record<string, { headline: string; detail: string }> = {
  Reading: {
    headline: 'Deep focus: Reading lane armed',
    detail: 'True/False banks paired with Cambridge 20-01 sets.'
  },
  Listening: {
    headline: 'Listening wave primed',
    detail: 'High fidelity audio cues ready with waveform scrub.'
  },
  Speaking: {
    headline: 'Speaking studio live',
    detail: 'Tempo tracker + Task 2 prompts in queue.'
  },
  Writing: {
    headline: 'Writing sandbox synced',
    detail: 'Structure prompts loaded with AI critique toggles.'
  },
  'AI Quiz': {
    headline: 'AI quiz',
    detail: 'Generate context, vocab, or grammar drills instantly.'
  }
};

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

      const response = await fetch('/api/reviewaiapi', {
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
    if (activeTab !== 'AI Quiz') return;
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

  const userInitial = user?.firstName?.charAt(0) || 'U';
  const displayName = user?.firstName
    ? `${user.firstName}${user?.lastName ? ` ${user.lastName}` : ''}`
    : 'Pilot';
  const userTagline = user?.email || 'pilot@unbabelmind.com';
  const currentInsight = skillInsights[activeTab] || skillInsights['Reading'];
  const stageNote = stageNotes[activeTab] || stageNotes['Reading'];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#030712] text-white">
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,155,240,0.25),_transparent_60%)] opacity-60"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: '120px 120px'
            }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
            <header className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.45em] text-white/50">Command center</p>
                <h1 className="text-3xl md:text-4xl font-semibold">Flight deck dashboard</h1>
                <p className="text-slate-300 text-sm max-w-xl">
                  Clean typography, subtle glow, and pill controls mirror the intro page aesthetic while leaning into the calm X-inspired timeline feel.
                </p>
              </div>
              <div className="flex flex-col gap-4 items-start md:items-end">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white text-black font-semibold flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-sm text-white/60">{userTagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push(`/profile?tab=${activeTab}`)}
                    className="px-5 py-2 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/40 text-sm transition"
                  >
                    View profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 hover:bg-slate-200 transition"
                  >
                    Logout
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
              {quickStats.map(stat => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-[0_25px_60px_rgba(2,6,23,0.45)] flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-white/40">
                      <span>{stat.label}</span>
                      <Icon className="w-4 h-4 text-sky-400" />
                    </div>
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.meta}</p>
                  </div>
                );
              })}
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-white/40">Live feed</p>
                    <p className="text-xl font-semibold text-white">Practice stream</p>
                  </div>
                  <span className="text-xs text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full uppercase tracking-[0.3em]">Synced</span>
                </div>
                <div className="space-y-4">
                  {practiceFeed.map(item => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 flex items-center justify-between gap-4 hover:border-white/30 transition"
                    >
                      <div>
                        <p className="text-white font-semibold">{item.title}</p>
                        <p className="text-slate-400 text-sm">{item.detail}</p>
                      </div>
                      <span className="text-xs text-white/40 uppercase tracking-[0.3em]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-[#050b14] p-6 space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">{currentInsight.title}</p>
                <ul className="space-y-3 text-sm text-slate-200">
                  {currentInsight.cues.map(cue => (
                    <li key={cue} className="flex gap-3">
                      <span className="w-2 h-2 mt-1 rounded-full bg-sky-400"></span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push(`/profile?tab=${activeTab}`)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
                >
                  Adjust preferences
                </button>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-[#050b14]/70 p-6 space-y-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">Skill console</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Sparkles className="w-5 h-5 text-sky-400" />
                      <span>Active focus: {activeTab}</span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full border border-white/15 text-white/60 uppercase tracking-[0.35em]">
                      Beta
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">
                    Tabs carry the same typographic system as the intro page so the transition into the dashboard is seamless.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      onMouseEnter={() => setHoveredTab(tab)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-5 py-2 rounded-full border text-sm transition ${
                        activeTab === tab
                          ? 'border-white text-white bg-white/10'
                          : hoveredTab === tab
                            ? 'border-white/25 text-white/80'
                            : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'AI Quiz' ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {['Context Understanding', 'English to English', 'Grammar MCQ'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleOptionChange(opt)}
                        className={`px-4 py-2 rounded-2xl text-sm border transition ${
                          activeOption === opt
                            ? 'border-white text-black bg-white'
                            : 'border-white/15 text-white/70 hover:text-white hover:border-white/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent"></div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Prompt</p>
                            <p className="text-lg font-semibold">Q{currentQuestion + 1} · {activeOption}</p>
                          </div>
                          <Target className="w-5 h-5 text-sky-400" />
                        </div>
                        {isLoadingQuestion ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div className="h-12 w-12 border-4 border-white/10 border-t-sky-400 rounded-full animate-spin"></div>
                            <p className="text-sm text-white/70">Generating AI question…</p>
                          </div>
                        ) : question ? (
                          <p className="text-lg leading-relaxed text-slate-100">{question.question}</p>
                        ) : (
                          <p className="text-sm text-white/60">No questions yet—generate one to get started.</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Answer lane</p>
                      {question && !isLoadingQuestion ? (
                        <div className="space-y-3">
                          {question.options.map((option, idx) => {
                            let buttonClass = 'w-full rounded-2xl border p-4 text-left text-sm transition relative';

                            if (answer.submitted) {
                              if (option === question.correct) {
                                buttonClass += ' border-emerald-400/60 bg-emerald-500/10 text-emerald-100';
                              } else if (option === answer.selected) {
                                buttonClass += ' border-rose-400/60 bg-rose-500/10 text-rose-100';
                              } else {
                                buttonClass += ' border-white/10 bg-white/5 text-white/70';
                              }
                            } else if (option === answer.selected) {
                              buttonClass += ' border-sky-400/70 bg-sky-500/10 text-white';
                            } else {
                              buttonClass += ' border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white';
                            }

                            return (
                              <button
                                key={idx}
                                className={buttonClass}
                                onClick={() => {
                                  if (!answer.submitted) handleAnswer(option);
                                }}
                              >
                                <span className="relative z-10">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-white/60">Answer options appear after the question loads.</p>
                      )}
                      {answer.submitted && question && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                          {answer.selected === question.correct ? 'Nice — that was the right pick.' : `Correct answer: ${question.correct}`}
                        </div>
                      )}
                      <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 items-center justify-between">
                        <button
                          disabled={currentQuestion === 0}
                          onClick={() => setCurrentQuestion(prev => prev - 1)}
                          className={`px-4 py-2 rounded-2xl text-sm border transition ${
                            currentQuestion === 0
                              ? 'border-white/10 text-white/30 cursor-not-allowed'
                              : 'border-white/20 text-white/80 hover:text-white hover:border-white/40'
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
                                generateQuestionFromLLM(activeOption);
                                setCurrentQuestion(prev => prev + 1);
                              }
                            }}
                            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition"
                          >
                            Next
                            <Zap className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (currentQuestion < currentQuestions.length - 1) {
                                  setCurrentQuestion(prev => prev + 1);
                                }
                              }}
                              className="px-4 py-2 rounded-2xl text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition"
                            >
                              Skip
                            </button>
                            <button
                              disabled={!answer.selected}
                              onClick={() => {
                                if (!answer.selected) return;
                                setAnswers(prev => ({
                                  ...prev,
                                  [currentQuestion]: { ...prev[currentQuestion], submitted: true }
                                }));
                              }}
                              className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold transition ${
                                answer.selected
                                  ? 'bg-rose-500 text-white hover:bg-rose-400'
                                  : 'bg-white/5 text-white/40 cursor-not-allowed'
                              }`}
                            >
                              <Brain className="w-4 h-4" /> Submit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Focus signal</p>
                      <p className="text-xl font-semibold text-white">{stageNote.headline}</p>
                      <p className="text-slate-400 text-sm">{stageNote.detail}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/40 uppercase tracking-[0.4em]">Skill</p>
                        <p className="text-lg font-semibold">{activeTab}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-sky-400" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-black/20 p-6 space-y-10">
                    {Array.from({ length: 20 }, (_, i) => {
                      const cambridgeSeries = 20 - i;
                      return (
                        <div key={cambridgeSeries} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-sm text-white/60">
                                {cambridgeSeries}
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Cambridge set</p>
                                <p className="text-2xl font-semibold text-white">IELTS Cambridge {cambridgeSeries}</p>
                              </div>
                            </div>
                            <span className="text-xs text-white/40">4 tests</span>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }, (_, j) => {
                              const testNumber = j + 1;
                              const testId = `${cambridgeSeries}-${testNumber}`;
                              return (
                                <button
                                  key={testId}
                                  onClick={() => router.push(`/${activeTab.toLowerCase()}/${cambridgeSeries}/${testNumber}`)}
                                  onMouseEnter={() => setHoveredTest(testId)}
                                  onMouseLeave={() => setHoveredTest(null)}
                                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition flex flex-col gap-2 ${
                                    hoveredTest === testId ? 'border-white/40 shadow-[0_20px_40px_rgba(15,23,42,0.5)] scale-[1.01]' : 'hover:border-white/30'
                                  }`}
                                >
                                  <span className="text-sm uppercase tracking-[0.3em] text-white/40">Test</span>
                                  <p className="text-xl font-semibold text-white flex items-center gap-2">
                                    {testNumber}
                                    {hoveredTest === testId && <Sparkles className="w-4 h-4 text-amber-300" />}
                                  </p>
                                  <p className="text-xs text-white/60">Jump into {activeTab.toLowerCase()} · Click to start</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
