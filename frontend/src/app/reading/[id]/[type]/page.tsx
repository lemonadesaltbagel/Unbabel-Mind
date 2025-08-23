'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, Highlight, Answers } from '@/types/reading';
import { loadAnswers, saveAnswers, loadHighlights, saveHighlights, loadPassage, loadQuestions, submitAnswers } from '@/utils/reading';
import { showToast } from '@/utils/toast';
import { createContextMenu, getTextPosition } from '@/utils/contextMenu';
import ReadingPassage from '@/components/ReadingPassage';
import ReadingQuestionList from '@/components/ReadingQuestionList';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';
import { useTimer } from '@/utils/useTimer';

export default function ReadingPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const passageId = Number(id);
  const questionType = Number(type);
  const localStorageKey = `reading-answers-${id}-${type}`;
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('Loading passage...');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [questionHighlights, setQuestionHighlights] = useState<Highlight[]>([]);
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
      const { title, content } = await loadPassage(id, type);
      setPassageTitle(title);
      setPassageContent(content);
    })();
  }, [id, type]);

  useEffect(() => {
    (async () => {
      setQuestions(await loadQuestions(id, type));
    })();
  }, [id, type]);

  useEffect(() => {
    setHighlights(loadHighlights(id, type));
  }, [id, type]);

  useEffect(() => {
    saveHighlights(id, type, highlights);
  }, [highlights, id, type]);

  const handleSubmit = async () => {
    if (isSubmitting || !user) return;
    
    setIsSubmitting(true);
    const answersData = questions
      .filter(q => q.type === 'tfng' || q.type === 'single' || q.type === 'multi' || q.type === 'fill-in-line')
      .map(q => {
        const questionNumber = (q as { number: number }).number;
        const userAnswer = answers[questionNumber] || ['—'];
        return { questionId: questionNumber, userAnswer };
      });
    
    const payload = {
      passageId,
      questionType,
      userId: Number(user.id),
      answers: answersData
    };
    
    const { ok, message } = await submitAnswers(payload);
    
    if (ok) {
      showToast('Submission successful!');
      setTimeout(() => {
        localStorage.removeItem(localStorageKey);
        router.push(`/reading/${id}/${type}/review`);
      }, 1000);
    } else {
      showToast(message, true);
    }
    
    setIsSubmitting(false);
  };

  const handleNavigation = (direction: 'back' | 'next') => {
    if (direction === 'back') {
      router.push('/dashboard?tab=Reading');
    } else {
      const nextType = questionType + 1;
      if (nextType >= 1 && nextType <= 4) {
        router.push(`/reading/${id}/${nextType}`);
      }
    }
  };

  const handleAnswersChange = (newAnswers: Answers) => {
    setAnswers(newAnswers);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;
    
    const selectedText = selection.toString().trim();
    const container = event.currentTarget as HTMLElement;
    const { start, end } = getTextPosition(container, selection);
    
    createContextMenu(
      event,
      selectedText,
      start,
      end,
      () => setHighlights(prev => [...prev, { text: selectedText, start, end, textId: 'passage' }]),
      () => setHighlights(prev => prev.filter(h => !(h.textId === 'passage' && start <= h.end && end >= h.start)))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const isContentMissing = passageContent === 'Failed to load passage.' || 
    (questions.length === 1 && questions[0].type === 'intro' && questions[0].text === 'Failed to load questions.');

  if (isContentMissing) {
    return <CopyrightMessage quizType="reading" quizId={id} questionType={type} />;
  }

  return (
    <div className="min-h-screen bg-black text-black p-6 flex flex-col items-center">
      <div className="w-full max-w-full flex justify-between items-center mb-4">
        <button onClick={() => router.push('/dashboard?tab=Reading')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
        <div className="text-white text-xl font-mono">{timeFormatted}</div>
        <div></div>
      </div>
      
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 w-full max-w-full">
        <ReadingPassage 
          title={passageTitle} 
          content={passageContent} 
          highlights={highlights} 
          onContextMenu={handleContextMenu}
        />
        <ReadingQuestionList 
          questions={questions} 
          answers={answers} 
          setAnswers={handleAnswersChange} 
          highlights={questionHighlights} 
          setHighlights={setQuestionHighlights}
        />
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
