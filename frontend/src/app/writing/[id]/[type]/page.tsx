'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, PencilLine, Sparkles, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadWritingPrompt, submitWriting, wordCount } from '@/utils/writing';
import { showToast } from '@/utils/toast';
import WritingPrompt from '@/components/WritingPrompt';
import EssayEditor from '@/components/EssayEditor';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';
import { useTimer } from '@/utils/useTimer';

export default function WritingPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const passageId = Number(id);
  const questionType = Number(type);
  const localStorageKey = `writing-answers-${id}-${type}`;
  const writingStages: Record<number, string> = {
    1: 'Outline sketch',
    2: 'Body build',
    3: 'Refine tone',
    4: 'Polish & send'
  };
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('Loading writing prompt...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [essay, setEssay] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const { timeFormatted } = useTimer();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const { title, content } = await loadWritingPrompt(id, type);
      setPassageTitle(title);
      setPassageContent(content);
    })();
  }, [id, type]);

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      setEssay(saved);
    }
  }, [localStorageKey]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, essay);
  }, [localStorageKey, essay]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const trimmedEssay = essay.trim();
    if (!trimmedEssay) {
      setShowConfirm(true);
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      passageId,
      questionType,
      userId: Number(user?.id),
      essay: trimmedEssay
    };
    
    const { ok, message } = await submitWriting(payload);
    
    if (ok) {
      showToast('Submission successful!');
      localStorage.removeItem(localStorageKey);
      router.push(`/writing/${id}/${type}/review`);
    } else {
      showToast(message, true);
    }
    
    setIsSubmitting(false);
  };

  const confirmEmpty = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    
    const payload = {
      passageId,
      questionType,
      userId: Number(user?.id),
      essay: ''
    };
    
    const { ok, message } = await submitWriting(payload);
    
    if (ok) {
      showToast('Empty submission confirmed and submitted!');
      localStorage.removeItem(localStorageKey);
      router.push(`/writing/${id}/${type}/review`);
    } else {
      showToast(message, true);
    }
    
    setIsSubmitting(false);
  };

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Writing');
    } else {
      const nextType = questionType + 1;
      if (nextType >= 1 && nextType <= 4) {
        router.push(`/writing/${id}/${nextType}`);
      }
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

  const isContentMissing = passageTitle === '' || passageContent === 'Failed to load writing prompt.';
  
  if (isContentMissing) {
    return <CopyrightMessage quizType="writing" quizId={id} questionType={type} />;
  }

  const words = wordCount(essay);
  const stageLabel = writingStages[questionType] || 'Calm drafting';

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1524] p-6 text-slate-200 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">Submit empty response?</h3>
            <p className="text-sm text-white/70 mb-6">You are about to send a blank essay. Continue?</p>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmEmpty}
                className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 transition"
              >
                Submit empty
              </button>
            </div>
          </div>
        </div>
      )}

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
          <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(2,6,23,0.45)] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard?tab=Writing')}
                className="rounded-2xl border border-white/15 p-3 text-white/70 hover:text-white hover:border-white/40 transition"
                aria-label="Back to dashboard"
              >
                <Home className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50">Writing cockpit</p>
                <h1 className="text-2xl font-semibold">Task {passageId}</h1>
                <p className="text-sm text-white/60">{stageLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
                <Timer className="h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Timer</p>
                  <p className="text-lg font-semibold text-white font-mono">{timeFormatted}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
                <PencilLine className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Word count</p>
                  <p className="text-lg font-semibold text-white">{words}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(2,6,23,0.55)] md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Mode</p>
                <p className="text-base font-semibold text-white">{stageLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <PencilLine className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Goal</p>
                <p className="text-base font-semibold text-white">
                  {questionType <= 2 ? 'Plan structure' : 'Tighten arguments'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Sparkles className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Cue</p>
                <p className="text-base font-semibold text-white">Lead with clear topic sentences</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <WritingPrompt title={passageTitle} content={passageContent} wordCount={words} />
            <EssayEditor essay={essay} setEssay={setEssay} />
          </div>
          
          <ReadingControls 
            questionType={questionType} 
            isSubmitting={isSubmitting} 
            onSubmit={handleSubmit} 
            onNavigate={handleNavigation}
          />
        </div>
      </div>
    </div>
  );
}
