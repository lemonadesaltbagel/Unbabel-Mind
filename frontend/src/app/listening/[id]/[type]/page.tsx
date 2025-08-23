'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/types/reading';
import { loadAnswers, saveAnswers, loadTranscript, loadQuestions, submitListening } from '@/utils/listening';
import { showToast } from '@/utils/toast';
import ListeningTranscript from '@/components/ListeningTranscript';
import ListeningQuestionList from '@/components/ListeningQuestionList';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';

export default function ListeningPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const passageId = Number(id);
  const questionType = Number(type);
  const localStorageKey = `listening-answers-${id}-${type}`;
  
  const [passageTitle, setPassageTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInitialLoad = useRef(true);

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
      const { title } = await loadTranscript(id, type);
      setPassageTitle(title);
    })();
  }, [id, type]);

  useEffect(() => {
    (async () => {
      setQuestions(await loadQuestions(id, type));
    })();
  }, [id, type]);

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
    
    const { ok, message, score, correctAnswers, totalQuestions } = await submitListening(payload);
    
    if (ok) {
      if (score !== undefined) {
        showToast(`Submission successful! Score: ${score}% (${correctAnswers}/${totalQuestions} correct)`);
      } else {
        showToast('Submission successful!');
      }
      localStorage.removeItem(localStorageKey);
      router.push(`/listening/${id}/${type}/review`);
    } else {
      showToast(message, true);
    }
    
    setIsSubmitting(false);
  };

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Listening');
    } else {
      const nextType = questionType + 1;
      if (nextType >= 1 && nextType <= 4) {
        router.push(`/listening/${id}/${nextType}`);
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
    (questions.length === 1 && questions[0].type === 'intro' && questions[0].text === 'Failed to load questions.');

  if (isContentMissing) {
    return <CopyrightMessage quizType="listening" quizId={id} questionType={type} />;
  }

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center relative">
      <div className="w-full flex justify-start mb-4">
        <button onClick={() => router.push('/dashboard?tab=Listening')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
      </div>
      
      <ListeningTranscript title={passageTitle} id={id} type={type} />
      
      <div className="w-full mt-[calc(14vh)]">
        <ListeningQuestionList questions={questions} answers={answers} setAnswers={setAnswers} />
      </div>
      
      <ReadingControls 
        questionType={questionType} 
        isSubmitting={isSubmitting} 
        onSubmit={handleSubmit} 
        onNavigate={handleNavigation}
      />
    </div>
  );
} 