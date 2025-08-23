import { SpeakingSubmission } from '@/types/speaking';
import { Question } from '@/types/reading';

export const getLocalStorageKey = (id: string, type: string) => `speaking-answers-${id}-${type}`;

export const loadAnswers = (id: string, type: string): Record<number, string[]> => {
  const storageKey = getLocalStorageKey(id, type);
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
};

export const saveAnswers = (id: string, type: string, answers: Record<number, string[]>): void => {
  const storageKey = getLocalStorageKey(id, type);
  localStorage.setItem(storageKey, JSON.stringify(answers));
};

export const loadSpeakingPrompt = async (id: string, type: string): Promise<{ title: string; content: string }> => {
  try {
    const response = await fetch(`/static/speaking/${id}_${type}.txt`);
    const text = await response.text();
    const [title, ...rest] = text.split('\n');
    return {
      title: title.trim(),
      content: rest.join('\n').trim()
    };
  } catch {
    return {
      title: '',
      content: 'Failed to load speaking prompt.'
    };
  }
};

export const loadQuestions = async (id: string, type: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/static/speaking/${id}_${type}_q.json`);
    return await response.json();
  } catch {
    return [{ type: 'intro', text: 'Failed to load questions.' }];
  }
};

export const submitSpeaking = async (payload: SpeakingSubmission): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return {
      ok: response.ok,
      message: result.message || 'Submission failed.'
    };
  } catch {
    return {
      ok: false,
      message: 'Network error.'
    };
  }
}; 