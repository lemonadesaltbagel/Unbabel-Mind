import { WritingSubmission, WritingRating, WritingRatingResponse, calculateWritingScore } from '@/types/writing';

export const loadWritingPrompt = async (id: string, type: string): Promise<{ title: string; content: string }> => {
  try {
    const response = await fetch(`/static/writing/${id}_${type}.txt`);
    const text = await response.text();
    const [title, ...rest] = text.split('\n');
    return {
      title: title.trim(),
      content: rest.join('\n').trim()
    };
  } catch {
    return {
      title: '',
      content: 'Failed to load writing prompt.'
    };
  }
};

export const submitWriting = async (payload: WritingSubmission): Promise<{ ok: boolean; message: string }> => {
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

export const wordCount = (text: string): number => {
  return text.split(' ').filter(word => word.length > 0).length;
};

export const getWritingRating = async (essay: string, prompt: string): Promise<WritingRatingResponse> => {
  try {
    const promptText = `You are an expert IELTS writing examiner. Rate the following essay based on IELTS Writing Task 2 criteria. The essay is responding to this prompt: "${prompt}"

Essay: "${essay}"

Rate each criterion on a scale of 0-9 (minimum gap 0.5):
1. Task Achievement (0-9): How well the essay addresses the task requirements
2. Coherence & Cohesion (0-9): How well organized and connected the ideas are
3. Lexical Resource (0-9): Vocabulary range and accuracy
4. Grammatical Range & Accuracy (0-9): Grammar usage and sentence structure

Respond ONLY with a JSON object in this exact format:
{"taskAchievement": X.X, "coherenceCohesion": X.X, "lexicalResource": X.X, "grammaticalRangeAccuracy": X.X, "feedback": "Your detailed feedback here"}

Where X.X is a number from 0 to 9 with 0.5 increments (e.g., 6.0, 6.5, 7.0, etc.).`;

    const response = await fetch('/api/reviewaiapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get rating');
    }

    const data = await response.json();
    const text = data.generated_text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const rating = JSON.parse(jsonMatch[0]) as WritingRating;
    const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRangeAccuracy, feedback } = rating;

    const validRating = {
      taskAchievement: Math.max(0, Math.min(9, Math.round(taskAchievement * 2) / 2)),
      coherenceCohesion: Math.max(0, Math.min(9, Math.round(coherenceCohesion * 2) / 2)),
      lexicalResource: Math.max(0, Math.min(9, Math.round(lexicalResource * 2) / 2)),
      grammaticalRangeAccuracy: Math.max(0, Math.min(9, Math.round(grammaticalRangeAccuracy * 2) / 2))
    };

    const { averageScore, finalScore } = calculateWritingScore(validRating);

    return {
      rating: validRating,
      averageScore,
      finalScore,
      feedback: feedback || 'No feedback provided.'
    };
  } catch (error) {
    console.error('Error getting writing rating:', error);
    return {
      rating: {
        taskAchievement: 0,
        coherenceCohesion: 0,
        lexicalResource: 0,
        grammaticalRangeAccuracy: 0
      },
      averageScore: 0,
      finalScore: 0,
      feedback: `Error getting rating: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 