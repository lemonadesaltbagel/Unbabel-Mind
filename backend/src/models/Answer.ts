import pool from '../config/database';

export interface Answer {
  id: number;
  user_id: number;
  passage_id: number;
  question_type: number;
  question_id: number;
  user_answer: string[];
  created_at: Date;
}

export const createAnswer = async (userId: number, passageId: number, questionType: number, questionId: number, userAnswer: string[]): Promise<Answer> => {
  const query = 'INSERT INTO answers (user_id, passage_id, question_type, question_id, user_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await pool.query(query, [userId, passageId, questionType, questionId, userAnswer]);
  return result.rows[0];
};

export const getAnswersByUserAndPassage = async (userId: number, passageId: number, questionType: number): Promise<Answer[]> => {
  const query = 'SELECT DISTINCT ON (question_id) * FROM answers WHERE user_id = $1 AND passage_id = $2 AND question_type = $3 ORDER BY question_id, created_at DESC';
  const result = await pool.query(query, [userId, passageId, questionType]);
  return result.rows;
};

export const initAnswersTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      passage_id INTEGER NOT NULL,
      question_type INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer TEXT[] NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
}; 