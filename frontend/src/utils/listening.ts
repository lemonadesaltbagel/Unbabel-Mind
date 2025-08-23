import type { ListeningSubmission } from '@/types/listening';
import type { Question } from '@/types/reading';

export const getLocalStorageKey = (id: string, type: string) => `listening-answers-${id}-${type}`;

export const getHighlightsLocalStorageKey = (id: string, type: string) => `listening-highlights-${id}-${type}`;

export const loadAnswers = (id: string, type: string): Record<number, string[]> => {
  const storageKey = getLocalStorageKey(id, type);
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
};

export const saveAnswers = (id: string, type: string, answers: Record<number, string[]>): void => {
  const storageKey = getLocalStorageKey(id, type);
  localStorage.setItem(storageKey, JSON.stringify(answers));
};

export const loadHighlights = (id: string, type: string): { text: string; start: number; end: number }[] => {
  const storageKey = getHighlightsLocalStorageKey(id, type);
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
};

export const saveHighlights = (id: string, type: string, highlights: { text: string; start: number; end: number }[]): void => {
  const storageKey = getHighlightsLocalStorageKey(id, type);
  localStorage.setItem(storageKey, JSON.stringify(highlights));
};

export const loadTranscript = async (id: string, type: string): Promise<{ title: string; content: string }> => {
  try {
    const response = await fetch(`/static/listening/${id}_${type}.txt`);
    const text = await response.text();
    const [title, ...rest] = text.split('\n');
    return {
      title: title.trim(),
      content: rest.join('\n').trim()
    };
  } catch {
    return {
      title: '',
      content: 'Failed to load audio transcript.'
    };
  }
};

export const loadQuestions = async (id: string, type: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/static/listening/${id}_${type}_q.json`);
    return await response.json();
  } catch {
    return [{ type: 'intro', text: 'Failed to load questions.' }];
  }
};

export const loadExplanations = async (id: string, type: string): Promise<{ number: number; text: string }[]> => {
  try {
    const response = await fetch(`/static/listening/${id}_${type}_e.json`);
    return await response.json();
  } catch {
    return [];
  }
};

export const submitListening = async (payload: ListeningSubmission): Promise<{ 
  ok: boolean; 
  message: string; 
  score?: number; 
  correctAnswers?: number; 
  totalQuestions?: number 
}> => {
  try {
    const response = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return {
      ok: response.ok,
      message: result.message || 'Submission failed.',
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions
    };
  } catch {
    return {
      ok: false,
      message: 'Network error.'
    };
  }
};

export const getListeningAnswers = async (
  userId: string, 
  passageId: string, 
  questionType: string
): Promise<Record<number, { questionNumber: number; userAnswer: string[] }>> => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${url}/answers/${userId}/${passageId}/${questionType}`);
    
    if (!response.ok) return {};
    
    const result = await response.json();
    if (!result.success) return {};
    
    const answers: Record<number, { questionNumber: number; userAnswer: string[] }> = {};
    if (result.data && Array.isArray(result.data)) {
      result.data.forEach((answer: { questionNumber: number; userAnswer: string[] }) => {
        answers[answer.questionNumber] = answer;
      });
    }
    
    return answers;
  } catch {
    return {};
  }
};

export const getListeningReviewAnswers = async (
  userId: string, 
  passageId: string, 
  questionType: string
): Promise<{ questionNumber: number; userAnswer: string[] }[]> => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${url}/answers/review/${userId}/${passageId}/${questionType}`);
    
    if (!response.ok) return [];
    
    const result = await response.json();
    if (!result.success) return [];
    
    return result.data;
  } catch {
    return [];
  }
};

export const getResultsWithCorrectAnswers = async (
  userId: number, 
  passageId: number, 
  questionType: number
): Promise<{ questionId: number; userAnswer: string[]; correctAnswer: string; isCorrect: boolean }[]> => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${url}/answers/review/${userId}/${passageId}/${questionType}`);
    
    if (!response.ok) return [];
    
    const result = await response.json();
    if (!result.success) return [];
    
    return result.data;
  } catch {
    return [];
  }
};

export const generateAudioDuration = (id: string, type: string): number => {
  const hash = id.split('').reduce((acc, char) => {
    acc = ((acc << 5) - acc) + char.charCodeAt(0);
    return acc & acc;
  }, 0) + type.split('').reduce((acc, char) => {
    acc = ((acc << 5) - acc) + char.charCodeAt(0);
    return acc & acc;
  }, 0);
  
  const min = 600;
  const max = 840;
  return min + (Math.abs(hash) % (max - min + 1));
}; 