import pool from '../config/database';

export interface Question {
  id: number;
  passage_id: number;
  question_type: number;
  question_number: number;
  correct_answer: string[];
  created_at: Date;
}

export const createQuestion = async (passageId: number, questionType: number, questionNumber: number, correctAnswer: string[]): Promise<Question> => {
  const query = 'INSERT INTO questions (passage_id, question_type, question_number, correct_answer) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await pool.query(query, [passageId, questionType, questionNumber, correctAnswer]);
  return result.rows[0];
};

export const getQuestionsByPassage = async (passageId: number, questionType: number): Promise<Question[]> => {
  const query = 'SELECT * FROM questions WHERE passage_id = $1 AND question_type = $2 ORDER BY question_number';
  const result = await pool.query(query, [passageId, questionType]);
  return result.rows;
};

export const initQuestionsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      passage_id INTEGER NOT NULL,
      question_type INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      correct_answer TEXT[] NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
}; 