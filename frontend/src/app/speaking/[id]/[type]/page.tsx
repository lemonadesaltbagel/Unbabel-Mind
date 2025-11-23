'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home, Mic, Sparkles, Target, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/types/reading';
import { loadAnswers, saveAnswers, loadSpeakingPrompt, loadQuestions, submitSpeaking } from '@/utils/speaking';
import { showToast } from '@/utils/toast';
import SpeakingPrompt from '@/components/SpeakingPrompt';
import ListeningQuestionList from '@/components/ListeningQuestionList';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';
import { useTimer } from '@/utils/useTimer';

export default function SpeakingPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const passageId = Number(id);
  const questionType = Number(type);
  const localStorageKey = `speaking-answers-${id}-${type}`;
  const speakingStages: Record<number, string> = {
    1: 'Warm launch',
    2: 'Detail dive',
    3: 'Opinion clarity',
    4: 'Wrap-up polish'
  };
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('Loading speaking prompt...');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const { timeFormatted } = useTimer();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    setAnswers(loadAnswers(id, type));
    isInitialLoad.current = true;
  }, [id, type]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      saveAnswers(id, type, answers);
    }
  }, [answers, id, type]);

  useEffect(() => {
    (async () => {
      const { title, content } = await loadSpeakingPrompt(id, type);
      setPassageTitle(title);
      setPassageContent(content);
    })();
  }, [id, type]);

  useEffect(() => {
    (async () => {
      setQuestions(await loadQuestions(id, type));
    })();
  }, [id, type]);

  const startRecording = () => setRecording(true);
  
  const stopRecording = () => {
    setRecording(false);
    setAudioUrl('recording-placeholder.mp3');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const payload = {
      passageId,
      questionType,
      userId: Number(user?.id) || 123,
      answers: Object.entries(answers).map(([questionId, userAnswer]) => ({
        questionId: Number(questionId),
        userAnswer
      }))
    };
    
    const { ok, message } = await submitSpeaking(payload);
    
    if (ok) {
      showToast('Submission successful!');
      localStorage.removeItem(localStorageKey);
      router.push('/dashboard');
    } else {
      showToast(message, true);
    }
    
    setIsSubmitting(false);
  };

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Speaking');
    } else {
      const nextType = questionType + 1;
      if (nextType >= 1 && nextType <= 4) {
        router.push(`/speaking/${id}/${nextType}`);
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

  const isContentMissing = passageTitle === '' || 
    passageContent === 'Failed to load speaking prompt.' || 
    (questions.length === 1 && questions[0].type === 'intro' && questions[0].text === 'Failed to load questions.');

  if (isContentMissing) {
    return <CopyrightMessage quizType="speaking" quizId={id} questionType={type} />;
  }

  const totalQuestions = questions.filter(q => typeof (q as { number?: number }).number === 'number').length;
  const answeredCount = Object.values(answers).filter(entry => entry.some(answer => answer && answer !== '-')).length;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const stageLabel = speakingStages[questionType] || 'Live rehearsal';

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.2),_transparent_60%)] opacity-60" />
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
                onClick={() => router.push('/dashboard?tab=Speaking')}
                className="rounded-2xl border border-white/15 p-3 text-white/70 hover:text-white hover:border-white/40 transition"
                aria-label="Back to dashboard"
              >
                <Home className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50">Speaking cockpit</p>
                <h1 className="text-2xl font-semibold">Task {passageId}</h1>
                <p className="text-sm text-white/60">{stageLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
                <Timer className="h-5 w-5 text-pink-300" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Timer</p>
                  <p className="text-lg font-semibold text-white font-mono">{timeFormatted}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Progress</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-2 w-32 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-300 to-amber-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-white/70">{answeredCount}/{totalQuestions || '-'}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(2,6,23,0.55)] md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Mic className="h-5 w-5 text-rose-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Mic status</p>
                <p className="text-base font-semibold text-white">{recording ? 'Recording live' : 'Ready'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Mode</p>
                <p className="text-base font-semibold text-white">{stageLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Focus</p>
                <p className="text-base font-semibold text-white">
                  {questionType <= 2 ? 'Paint vivid scenes' : 'Defend your stance'}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <SpeakingPrompt 
              title={passageTitle} 
              content={passageContent} 
              recording={recording} 
              audioUrl={audioUrl} 
              onStartRecording={startRecording} 
              onStopRecording={stopRecording}
            />
            <ListeningQuestionList questions={questions} answers={answers} setAnswers={setAnswers} />
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
