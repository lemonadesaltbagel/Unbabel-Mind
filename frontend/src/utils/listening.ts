import { ListeningSubmission } from '@/types/listening';
import { Question } from '@/types/reading';

export const lk = (id: string, type: string) => `listening-answers-${id}-${type}`;
export const hlk = (id: string, type: string) => `listening-highlights-${id}-${type}`;

export const ld = (id: string, type: string): Record<number, string[]> => {
  const s = localStorage.getItem(lk(id, type));
  return s ? JSON.parse(s) : {};
};

export const sv = (id: string, type: string, a: Record<number, string[]>): void => {
  localStorage.setItem(lk(id, type), JSON.stringify(a));
};

export const ldh = (id: string, type: string): { text: string; start: number; end: number }[] => {
  const s = localStorage.getItem(hlk(id, type));
  return s ? JSON.parse(s) : [];
};

export const svh = (id: string, type: string, h: { text: string; start: number; end: number }[]): void => {
  localStorage.setItem(hlk(id, type), JSON.stringify(h));
};

export const ldp = async (id: string, type: string): Promise<{ title: string; content: string }> => {
  try {
    const res = await fetch(`/static/listening/${id}_${type}.txt`);
    const text = await res.text();
    const [tl, ...rest] = text.split('\n');
    return { title: tl.trim(), content: rest.join('\n').trim() };
  } catch {
    return { title: '', content: 'Failed to load audio transcript.' };
  }
};

export const ldq = async (id: string, type: string): Promise<Question[]> => {
  try {
    const res = await fetch(`/static/listening/${id}_${type}_q.json`);
    return await res.json();
  } catch {
    return [{ type: 'intro', text: 'Failed to load questions.' }];
  }
};

export const lde = async (id: string, type: string): Promise<{ number: number; text: string }[]> => {
  try {
    const res = await fetch(`/static/listening/${id}_${type}_e.json`);
    return await res.json();
  } catch {
    return [];
  }
};

export const sub = async (pl: ListeningSubmission): Promise<{ ok: boolean; message: string; score?: number; correctAnswers?: number; totalQuestions?: number }> => {
  try {
    const res = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pl)
    });
    const result = await res.json();
    return {
      ok: res.ok,
      message: result.message || 'Submission failed.',
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions
    };
  } catch {
    return { ok: false, message: 'Network error.' };
  }
};

export const ldFromBackend = async (userId: number, passageId: number, questionType: number): Promise<Record<number, string[]>> => {
  try {
    // 读取环境变量，兼容前后端容器通信
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/answers/${userId}/${passageId}/${questionType}`);
    if (!res.ok) return {};
    const result = await res.json();
    if (!result.success) return {};
    const answers: Record<number, string[]> = {};
    result.data.forEach((a: { question_id: number; user_answer: string[] }) => {
      answers[a.question_id] = a.user_answer;
    });
    return answers;
  } catch {
    return {};
  }
}; 