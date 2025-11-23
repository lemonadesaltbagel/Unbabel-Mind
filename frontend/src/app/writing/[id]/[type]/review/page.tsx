"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Home, Lightbulb, PenSquare, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadWritingPrompt, getWritingRating } from '@/utils/writing';
import { useTestPageTitle } from '@/utils/usePageTitle';
import { WritingRatingResponse } from '@/types/writing';

export default function WritingReviewPage() {
  useTestPageTitle();
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const writingStages: Record<number, string> = {
    1: 'Outline audit',
    2: 'Body feedback',
    3: 'Style polish',
    4: 'Final verdict'
  };
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('');
  const [essay, setEssay] = useState('');
  const [rating, setRating] = useState<WritingRatingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [essayLoading, setEssayLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { title, content } = await loadWritingPrompt(id, type);
      setPassageTitle(title);
      setPassageContent(content);
    })();
  }, [id, type]);

  useEffect(() => {
    if (user && id && type) {
      setEssayLoading(true);
      setError('');
      fetch(`/api/answers/essay/${user.id}/${id}/${type}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) setEssay(data.data.essay_text);
          else {
            const saved = localStorage.getItem(`writing-answers-${id}-${type}`);
            if (saved) setEssay(saved);
            else setError('No essay found for this task');
          }
          setEssayLoading(false);
        })
        .catch(() => {
          const saved = localStorage.getItem(`writing-answers-${id}-${type}`);
          if (saved) setEssay(saved);
          else setError('Failed to load essay');
          setEssayLoading(false);
        });
    }
  }, [user, id, type]);

  const getFeedback = useCallback(async () => {
    if (!essay || !passageContent) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await getWritingRating(essay, `${passageTitle}\n\n${passageContent}`);
      setRating(result);
    } catch {
      setError('Failed to get AI feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [essay, passageContent, passageTitle]);

  useEffect(() => {
    if (essay && passageContent && !rating && !isLoading && !error) getFeedback();
  }, [essay, passageContent, passageTitle, rating, isLoading, error, getFeedback]);

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Writing');
    } else {
      const nextType = Number(type) + 1;
      if (nextType >= 1 && nextType <= 4) router.push(`/writing/${id}/${nextType}/review`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (passageTitle === '' || passageContent === 'Failed to load writing prompt.') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Failed to load writing prompt.</div>
      </div>
    );
  }

  const wordTotal = essay.split(' ').filter(w => w.length > 0).length;
  const stageLabel = writingStages[Number(type)] || 'Review insights';
  const isLastSet = Number(type) >= 4;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_60%)] opacity-60" />
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
                onClick={() => router.push('/dashboard?tab=Writing')}
                className="rounded-2xl border border-white/15 p-3 text-white/70 hover:text-white hover:border-white/40 transition"
                aria-label="Back to dashboard"
              >
                <Home className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50">Review cockpit</p>
                <h1 className="text-2xl font-semibold">Writing Task {type}</h1>
                <p className="text-sm text-white/60">{stageLabel}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-white/70 flex-wrap">
              <div className="rounded-2xl border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Words</p>
                <p className="text-3xl font-semibold text-white">{wordTotal}</p>
              </div>
              <div className="rounded-2xl border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Final score</p>
                <p className="text-lg font-semibold text-white">{rating?.finalScore ?? '-'}</p>
              </div>
            </div>
          </header>

          <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(2,6,23,0.45)] md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <PenSquare className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Stage</p>
                <p className="text-base font-semibold text-white">{stageLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Focus</p>
                <p className="text-base font-semibold text-white">
                  {rating ? 'Deep AI critique' : 'Awaiting feedback'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Lightbulb className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Status</p>
                <p className="text-base font-semibold text-white">
                  {isLoading ? 'Analyzing...' : rating ? 'Feedback ready' : 'Tap retry'}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,2fr)] items-start">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-white">Writing prompt</h2>
              <h3 className="font-semibold text-lg text-white mb-3">{passageTitle}</h3>
              <div className="whitespace-pre-wrap text-sm text-slate-200">{passageContent}</div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-white">Your essay</h2>
              {essayLoading ? (
                <div className="flex items-center justify-center h-32 text-white/60">Loading essay...</div>
              ) : essay ? (
                <div>
                  <div className="whitespace-pre-wrap text-sm text-slate-200 mb-4">{essay}</div>
                  <div className="text-xs text-white/60">Word Count: {wordTotal}</div>
                </div>
              ) : (
                <div className="text-center text-white/50 mt-4">No essay submitted for this task</div>
              )}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.45)] h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-white">AI feedback</h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-32 text-white/60">Analyzing your essay...</div>
              ) : rating ? (
                <div className="space-y-4 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold mb-2 text-white">IELTS band detail</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Task Achievement</span>
                        <span className="font-semibold text-white">{rating.rating.taskAchievement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coherence & Cohesion</span>
                        <span className="font-semibold text-white">{rating.rating.coherenceCohesion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lexical Resource</span>
                        <span className="font-semibold text-white">{rating.rating.lexicalResource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grammar Range & Accuracy</span>
                        <span className="font-semibold text-white">{rating.rating.grammaticalRangeAccuracy}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold">
                        <span>Final score</span>
                        <span className="text-amber-300">{rating.finalScore}</span>
                      </div>
                      <p className="text-xs text-white/50">Average: {rating.averageScore.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold mb-2 text-white">Detailed feedback</h3>
                    <div className="whitespace-pre-wrap">{rating.feedback}</div>
                  </div>
                  <p className="text-xs text-white/50 italic">Generated by Unbabel AI</p>
                </div>
              ) : error ? (
                <div className="text-center text-rose-300">
                  <div className="mb-2">{error}</div>
                  <button
                    onClick={getFeedback}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/40 transition disabled:opacity-50"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="text-center text-white/50 mt-4">No feedback available</div>
              )}
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
              disabled={isLastSet}
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-2 text-sm font-semibold transition ${
                isLastSet ? 'border-white/5 text-white/40 cursor-not-allowed' : 'border-white/10 bg-white text-black hover:bg-slate-100'
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
