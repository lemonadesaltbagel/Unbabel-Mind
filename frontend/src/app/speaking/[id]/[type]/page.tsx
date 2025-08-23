'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/types/reading';
import { loadAnswers, saveAnswers, loadSpeakingPrompt, loadQuestions, submitSpeaking } from '@/utils/speaking';
import { showToast } from '@/utils/toast';
import SpeakingPrompt from '@/components/SpeakingPrompt';
import ListeningQuestionList from '@/components/ListeningQuestionList';
import ReadingControls from '@/components/ReadingControls';
import CopyrightMessage from '@/components/CopyrightMessage';
import { useTestPageTitle } from '@/utils/usePageTitle';

export default function SpeakingPage() {
  useTestPageTitle();
  
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { id, type } = params as { id: string; type: string };
  const passageId = Number(id);
  const questionType = Number(type);
  const localStorageKey = `speaking-answers-${id}-${type}`;
  
  const [passageTitle, setPassageTitle] = useState('');
  const [passageContent, setPassageContent] = useState('Loading speaking prompt...');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
      userId: 123,
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

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <button onClick={() => router.push('/dashboard?tab=Speaking')}>
          <Home className="w-6 h-6 text-white hover:text-blue-500 transition" />
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-6xl">
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
  );
} 