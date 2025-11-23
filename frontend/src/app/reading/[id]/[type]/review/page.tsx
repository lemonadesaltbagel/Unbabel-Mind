"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, BookOpen, Home, Lightbulb, Sparkles, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadPassage, loadQuestions, loadHighlights, loadExplanations, getResultsWithCorrectAnswers } from '@/utils/reading';
import { useTestPageTitle } from '@/utils/usePageTitle';
import { checkTokenAndWarn } from '@/utils/tokenCheck';

interface Question {
  type: string;
  text?: string;
  number?: number;
  question?: string;
  options?: string[];
  correctAnswer?: string;
}

interface Highlight {
  text: string;
  start: number;
  end: number;
}

export default function ReviewPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evidence, setEvidence] = useState<{ number: number; text: string }[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<{ questionId: number; userAnswer: string[]; correctAnswer: string; isCorrect: boolean }[]>([]);
  const readingStages: Record<number, string> = {
    1: 'Preview & skim',
    2: 'Locate details',
    3: 'Reason & match',
    4: 'Final sweep'
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { title, content } = await loadPassage(id, type);
      setPassageTitle(title);
      setPassageContent(content);
    })();
    
    (async () => setQuestions(await loadQuestions(id, type)))();
    
    (async () => {
      if (user) {
        const backendResults = await getResultsWithCorrectAnswers(Number(user.id), Number(id), Number(type));
        setResults(backendResults);
      }
    })();
    
    setHighlights(loadHighlights(id, type));
    
    (async () => setEvidence(await loadExplanations(id, type)))();
  }, [id, type, user]);

  useEffect(() => {
    if (questions.length > 0 && results.length > 0 && evidence.length > 0) {
      const wrongQuestions = results
        .filter(result => !result.isCorrect)
        .map(result => {
          const question = questions.find(q => q.number === result.questionId);
          return {
            ...question,
            userAnswer: result.userAnswer[0] || '',
            correctAnswer: result.correctAnswer
          };
        });

      if (wrongQuestions.length === 0) {
        setAiSuggestions([
          "Focus on reading comprehension strategies",
          "Practice identifying key information in passages",
          "Work on vocabulary building exercises",
          "Review question types you struggled with"
        ]);
        return;
      }

      setIsLoading(true);
      const prompt = `You are an expert IELTS tutor with deep knowledge of reading comprehension strategies and test preparation.

Background: The user has completed a reading comprehension test and made some mistakes. Your task is to analyze their performance and provide personalized improvement suggestions.

Wrong Questions Analysis:
${wrongQuestions.map(q => `- Question ${q.number}: ${q.question}
    Type: ${q.type}
    User Answer: ${q.userAnswer}
    Correct Answer: ${q.correctAnswer}
    Evidence: ${evidence.filter(e => e.number === q.number).map(e => e.text).join('; ')}`).join('\n')}

Please provide 4-6 specific, actionable suggestions to help the user improve their reading comprehension skills based on their mistakes. Focus on the specific question types and skills they struggled with.

Respond with plain text suggestions only, one per line, without any formatting or JSON structure.`;

      callGptApi(prompt)
        .then(response => {
          try {
            const suggestions = response
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .slice(0, 6);
            
            if (suggestions.length > 0) {
              setAiSuggestions(suggestions);
            } else {
              setAiSuggestions([
                "Focus on reading comprehension strategies",
                "Practice identifying key information in passages",
                "Work on vocabulary building exercises",
                "Review question types you struggled with"
              ]);
            }
          } catch {
            setAiSuggestions([
              "Focus on reading comprehension strategies",
              "Practice identifying key information in passages",
              "Work on vocabulary building exercises",
              "Review question types you struggled with"
            ]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [questions, results, evidence]);

  const callGptApi = async (prompt: string): Promise<string> => {
    try {
      const hasToken = await checkTokenAndWarn();
      if (!hasToken) return 'Please configure your OpenAI API token in your profile to use AI features.';
      
      const token = localStorage.getItem('token');
      if (!token) return 'No authentication token';
      
      const response = await fetch('/api/reviewaiapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        try {
          const err = await response.json();
          return err.error || 'Error calling Unbabel API.';
        } catch {
          return 'Error calling Unbabel API.';
        }
      }
      const data = await response.json();
      return data.generated_text || 'No response from AI';
    } catch {
      return 'Error calling Unbabel API.';
    }
  };

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Reading');
    } else {
      const nextType = Number(type) + 1;
      if (nextType >= 1 && nextType <= 4) {
        router.push(`/reading/${id}/${nextType}`);
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setShowContextMenu(true);
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const passageRange = range.cloneRange();
    passageRange.selectNodeContents(document.querySelector('.passage-content') as Node);
    passageRange.setEnd(range.startContainer, range.startOffset);
    const start = passageRange.toString().length;
    
    setHighlights(prev => [...prev, { text: selectedText, start, end: start + selectedText.length }]);
    setShowContextMenu(false);
  };

  const handleClearHighlight = () => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const passageRange = range.cloneRange();
    passageRange.selectNodeContents(document.querySelector('.passage-content') as Node);
    passageRange.setEnd(range.startContainer, range.startOffset);
    const start = passageRange.toString().length;
    const end = start + selectedText.length;
    
    setHighlights(prev => prev.filter(h => !(start <= h.end && end >= h.start)));
    setShowContextMenu(false);
  };

  const handleParaphrase = async () => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    
    setIsLoading(true);
    try {
      const prompt = `You are an expert IELTS tutor helping students understand complex vocabulary. Your task is to paraphrase the selected text using simpler, more common words while maintaining the same meaning.

Text: "${selectedText}"

Please paraphrase using simpler vocabulary for B1-B2 level learners.`;
      
      const response = await callGptApi(prompt);
      setAiResponse(response);
    } finally {
      setIsLoading(false);
      setShowContextMenu(false);
    }
  };

  const handleExplain = async (questionNumber: number, userAnswer: string, correctAnswer: string) => {
    setIsLoading(true);
    try {
      const question = questions.find(q => q.number === questionNumber);
      if (!question) return;
      
      const questionEvidence = evidence.filter(e => e.number === questionNumber);
      const backgroundInfo = `This is an IELTS Reading test. The user is reviewing their performance on question ${questionNumber} of passage ${id}, type ${type}.`;
      
      const prompt = `You are an expert IELTS tutor with deep knowledge of reading comprehension strategies and test preparation.

Background Setting:
${backgroundInfo}

Question Analysis:
- Question Number: ${questionNumber}
- Question Type: ${question.type}
- Question: ${question.question}
- Available Options: ${question.options?.join(', ') || 'N/A'}
- User's Answer: "${userAnswer}"
- Correct Answer: "${correctAnswer}"

Evidence from Reading Passage:
${questionEvidence.map(e => `- Evidence ${e.number}: ${e.text}`).join('\n')}

Your Task:
1. Analyze why the correct answer "${correctAnswer}" is the right choice based on the evidence provided
2. Analyze why the user might have chosen "${userAnswer}" - what could have led to this mistake?
3. Identify the specific reading skills or strategies the user needs to improve
4. Provide specific, actionable suggestions for improvement

IMPORTANT: Respond in plain text format, NOT JSON. Structure your response as follows:

**Why the correct answer is right:**
[Your explanation here]

**Why the user made this mistake:**
[Your analysis here]

**Skills to improve:**
[Specific reading skills that need work]

**Suggestions:**
[3-4 actionable tips for improvement]

Keep your response concise, clear, encouraging, and focused on helping the user improve their reading comprehension skills.`;
      
      const response = await callGptApi(prompt);
      setAiResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const scorePercent = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const highlightCount = highlights.length;
  const stageLabel = readingStages[Number(type)] || 'Review insights';

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.25),_transparent_60%)] opacity-60" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '120px 120px'
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
          <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(2,6,23,0.45)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard?tab=Reading')}
                className="rounded-2xl border border-white/15 p-3 text-white/70 hover:text-white hover:border-white/40 transition"
                aria-label="Back to dashboard"
              >
                <Home className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50">Review cockpit</p>
                <h1 className="text-2xl font-semibold">Reading Passage {type}</h1>
                <p className="text-sm text-white/60">{stageLabel}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-white/70 flex-wrap">
              <div className="rounded-2xl border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Score</p>
                <p className="text-3xl font-semibold text-white">{scorePercent}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Correct</p>
                <p className="text-lg font-semibold text-white">{correctAnswers}/{totalQuestions || '-'}</p>
              </div>
            </div>
          </header>

          <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(2,6,23,0.45)] md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Accuracy</p>
                <p className="text-base font-semibold text-white">{scorePercent >= 70 ? 'Exam ready' : 'Needs polish'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <BookOpen className="h-5 w-5 text-sky-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Stage</p>
                <p className="text-base font-semibold text-white">{stageLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Lightbulb className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Highlights</p>
                <p className="text-base font-semibold text-white">{highlightCount} saved</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,2fr)_minmax(0,1.2fr)] items-start">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-semibold text-white">Unbabel AI</h2>
              </div>
              {isLoading ? (
                <div className="flex justify-center h-32 items-center text-white/50 text-sm">Crunching your insights...</div>
              ) : aiResponse ? (
                <div className="space-y-4 text-sm text-slate-200 whitespace-pre-wrap">
                  {aiResponse}
                </div>
              ) : (
                <div className="text-center text-white/50 text-sm mt-6">Select a question to get instant coaching.</div>
              )}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Passage</p>
                  <h2 className="text-2xl font-semibold text-white">{passageTitle}</h2>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-200 passage-content" onContextMenu={handleContextMenu}>
                {(() => {
                  let lastIndex = 0;
                  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
                  const result = [];
                  sortedHighlights.forEach((highlight, index) => {
                    if (highlight.start > lastIndex) {
                      result.push(<span key={`text-${index}`}>{passageContent.slice(lastIndex, highlight.start)}</span>);
                    }
                    result.push(<span key={`highlight-${index}`} className="bg-sky-400/30 text-white rounded-sm px-0.5">{passageContent.slice(highlight.start, highlight.end)}</span>);
                    lastIndex = highlight.end;
                  });
                  if (lastIndex < passageContent.length) {
                    result.push(<span key="text-last">{passageContent.slice(lastIndex)}</span>);
                  }
                  return result;
                })()}
              </div>
              {showContextMenu && (
                <div
                  ref={contextMenuRef}
                  className="fixed rounded-2xl border border-white/10 bg-[#0d1524] text-sm text-white/80 shadow-2xl backdrop-blur-xl overflow-hidden z-50"
                  style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
                >
                  <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition" onClick={handleHighlight}>
                    Highlight
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition" onClick={handleClearHighlight}>
                    Clear highlight
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition" onClick={handleParaphrase}>
                    Paraphrase with Unbabel
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-white">Your answers</h2>
                <ol className="space-y-4 text-sm text-slate-200">
                  {questions.map((q, i) => {
                    if (q.type === 'intro' || q.type === 'subheading') {
                      return <div key={`${q.type}-${i}`} className="text-base font-semibold mb-3 whitespace-pre-line text-white/80">{q.text}</div>;
                    }
                    if (q.type === 'fill-in-line') {
                      const result = results.find(r => r.questionId === q.number);
                      const userAns = result?.userAnswer[0] || '-';
                      const correct = result?.correctAnswer || 'N/A';
                      const isCorrect = result?.isCorrect || false;
                      return (
                        <li key={`fill-${q.number}`} className="rounded-2xl border border-white/5 p-3">
                          <div className="mb-2 font-semibold text-white">
                            {q.number}. {q.text?.split('____').map((part, j, arr) => (
                              <span key={j}>{part}{j < arr.length - 1 && <span className="inline-block min-w-[120px] rounded-xl border border-white/20 bg-white/5 px-2 py-1 mx-1 text-sm text-white">{userAns}</span>}</span>
                            ))}
                          </div>
                          <div className={isCorrect ? 'text-emerald-400 text-sm' : 'text-rose-300 text-sm'}>Your answer: {userAns}</div>
                          {!isCorrect && (
                            <>
                              <div className="text-sky-300 text-sm">Correct answer: {correct}</div>
                              <button
                                className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-100 hover:border-amber-200/80 transition"
                                onClick={() => handleExplain(q.number!, userAns, correct)}
                              >
                                <Sparkles className="h-4 w-4" />
                                Unbabel breakdown
                              </button>
                            </>
                          )}
                        </li>
                      );
                    }
                    if (q.type === 'single' || q.type === 'multi' || q.type === 'tfng') {
                      const result = results.find(r => r.questionId === q.number);
                      const userAns = result?.userAnswer[0] || '-';
                      const correct = result?.correctAnswer || 'N/A';
                      const isCorrect = result?.isCorrect || false;
                      return (
                        <li key={`q-${q.number}`} className="rounded-2xl border border-white/5 p-3">
                          <div className="mb-2 font-semibold text-white">{q.number}. {q.question}</div>
                          <div className="flex flex-wrap gap-2 mb-2">{q.options?.map((o) => (
                            <span key={o} className={`px-3 py-1 rounded-full text-xs ${
                              userAns === o
                                ? 'bg-sky-400/20 text-white border border-sky-400/40'
                                : correct === o
                                  ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                                  : 'bg-white/5 text-white/60 border border-white/10'
                            }`}>
                              {o}
                            </span>
                          ))}</div>
                          <div className={isCorrect ? 'text-emerald-400 text-sm' : 'text-rose-300 text-sm'}>Your answer: {userAns}</div>
                          {!isCorrect && (
                            <>
                              <div className="text-sky-300 text-sm">Correct answer: {correct}</div>
                              <button
                                className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-100 hover:border-amber-200/80 transition"
                                onClick={() => handleExplain(q.number!, userAns, correct)}
                              >
                                <Sparkles className="h-4 w-4" />
                                Unbabel breakdown
                              </button>
                            </>
                          )}
                        </li>
                      );
                    }
                    if (!('number' in q) || !q.number) return null;
                    const result = results.find(r => r.questionId === q.number);
                    if (!result) return null;
                    const userAns = result.userAnswer[0] || '';
                    const correct = result.correctAnswer;
                    const isCorrect = result.isCorrect;
                    return (
                      <li key={i} className="rounded-2xl border border-white/5 p-3">
                        <div className="mb-2 font-semibold text-white">{q.number}. {q.question}</div>
                        <div className={isCorrect ? 'text-emerald-400 text-sm' : 'text-rose-300 text-sm'}>
                          Your answer: {userAns || '-'}
                        </div>
                        {!isCorrect && (
                          <>
                            <div className="text-sky-300 text-sm">Correct answer: {correct || 'N/A'}</div>
                            <button
                              className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-100 hover:border-amber-200/80 transition"
                              onClick={() => handleExplain(q.number!, userAns, correct || '')}
                            >
                              <Sparkles className="h-4 w-4" />
                              Unbabel breakdown
                            </button>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-8 rounded-2xl border border-white/5 p-4 text-sm text-slate-200 space-y-2">
                  <p>Total questions: {totalQuestions}</p>
                  <p>Correct answers: {correctAnswers}</p>
                  <p className="font-semibold text-white">Score: {scorePercent}%</p>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)]">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-amber-300" />
                  <h3 className="text-lg font-semibold text-white">Unbabel suggestions</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">Personalized nudges based on every miss.</p>
                {isLoading ? (
                  <div className="flex justify-center py-4 text-white/50 text-sm">Generating personalized suggestions...</div>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-100 list-disc list-inside">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleNavigation('back')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-2 text-sm font-medium text-white/80 hover:border-white/40 hover:text-white transition"
            >
              Back to dashboard
            </button>
            <button
              onClick={() => handleNavigation('next')}
              disabled={type === '3'}
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-2 text-sm font-semibold transition ${
                type === '3'
                  ? 'border-white/5 text-white/40 cursor-not-allowed'
                  : 'border-white/10 bg-white text-black hover:bg-slate-100'
              }`}
            >
              Next exercise
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
