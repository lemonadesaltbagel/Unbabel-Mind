export type WritingSubmission = {
  passageId: number;
  questionType: number;
  userId: number;
  essay: string;
};

export type WritingRating = {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRangeAccuracy: number;
  feedback?: string;
};

export type WritingRatingResponse = {
  rating: WritingRating;
  averageScore: number;
  finalScore: number;
  feedback: string;
};

export const calculateWritingScore = (rating: WritingRating): { averageScore: number; finalScore: number } => {
  const average = (rating.taskAchievement + rating.coherenceCohesion + rating.lexicalResource + rating.grammaticalRangeAccuracy) / 4;
  const final = Math.floor(average * 2) / 2;
  
  return {
    averageScore: average,
    finalScore: final
  };
}; 