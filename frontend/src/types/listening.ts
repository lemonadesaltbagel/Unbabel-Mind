export type ListeningSubmission = {
  passageId: number;
  questionType: number;
  userId: number;
  answers: Array<{ questionId: number; userAnswer: string[] }>;
}; 