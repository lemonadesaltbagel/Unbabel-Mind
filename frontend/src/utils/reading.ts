import { Question, Highlight, Answers, SubmissionPayload } from '@/types/reading';

export const getLocalStorageKey = (id: string, type: string) => `reading-answers-${id}-${type}`;

export const getHighlightsLocalStorageKey = (id: string, type: string) => `highlights-${id}-${type}`;

export const loadAnswers = (id: string, type: string): Answers => {
  const storageKey = getLocalStorageKey(id, type);
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
};

export const saveAnswers = (id: string, type: string, answers: Answers): void => {
  const storageKey = getLocalStorageKey(id, type);
  localStorage.setItem(storageKey, JSON.stringify(answers));
};

export const loadHighlights = (id: string, type: string): Highlight[] => {
  const storageKey = getHighlightsLocalStorageKey(id, type);
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
};

export const saveHighlights = (id: string, type: string, highlights: Highlight[]): void => {
  const storageKey = getHighlightsLocalStorageKey(id, type);
  localStorage.setItem(storageKey, JSON.stringify(highlights));
};

export const loadPassage = async (id: string, type: string): Promise<{ title: string; content: string }> => {
  try {
    const response = await fetch(`/static/reading/${id}_${type}.txt`);
    const text = await response.text();
    const [title, ...rest] = text.split('\n');
    return {
      title: title.trim(),
      content: rest.join('\n').trim()
    };
  } catch {
    return {
      title: '',
      content: 'Failed to load passage.'
    };
  }
};

export const loadQuestions = async (id: string, type: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/static/reading/${id}_${type}_q.json`);
    return await response.json();
  } catch {
    return [{ type: 'intro', text: 'Failed to load questions.' }];
  }
};

export const loadExplanations = async (id: string, type: string): Promise<{ number: number; text: string }[]> => {
  try {
    const response = await fetch(`/static/reading/${id}_${type}_e.json`);
    return await response.json();
  } catch {
    return [];
  }
};

export const submitAnswers = async (payload: SubmissionPayload): Promise<{ ok: boolean; message: string }> => {
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
      message: 'Submission error.'
    };
  }
};

export const loadFromBackend = async (userId: number, passageId: number, questionType: number): Promise<Answers> => {
  try {
    const response = await fetch(`/api/answers/${userId}/${passageId}/${questionType}`);
    if (!response.ok) return {};
    
    const result = await response.json();
    if (!result.success) return {};
    
    const answers: Answers = {};
    result.data.forEach((answer: { question_id: number; user_answer: string[] }) => {
      answers[answer.question_id] = answer.user_answer;
    });
    
    return answers;
  } catch {
    return {};
  }
};

export const getResultsWithCorrectAnswers = async (
  userId: number, 
  passageId: number, 
  questionType: number
): Promise<{ questionId: number; userAnswer: string[]; correctAnswer: string; isCorrect: boolean }[]> => {
  try {
    const response = await fetch(`/api/answers/review/${userId}/${passageId}/${questionType}`);
    if (!response.ok) return [];
    
    const result = await response.json();
    if (!result.success) return [];
    
    return result.data;
  } catch {
    return [];
  }
};

export const handleSelection = (questionNumber: number, option: string, isMulti: boolean, answers: Answers): Answers => {
  return {
    ...answers,
    [questionNumber]: isMulti
      ? (answers[questionNumber] || []).includes(option)
        ? (answers[questionNumber] || []).filter(x => x !== option)
        : [...(answers[questionNumber] || []), option]
      : [option]
  };
};

export const handleFillIn = (questionNumber: number, value: string, answers: Answers): Answers => {
  return {
    ...answers,
    [questionNumber]: [value]
  };
}; 