import pool from '../config/database';

export interface Result {
  id: number;
  user_id: number;
  passage_id: number;
  question_type: number;
  score: number | null;
  correct_answers: number | null;
  total_questions: number | null;
  submitted_at: Date;
}

export const createResult = async (userId: number, passageId: number, questionType: number, score: number | null, correctAnswers: number | null, totalQuestions: number | null): Promise<Result> => {
  const query = `
    INSERT INTO results (user_id, passage_id, question_type, score, correct_answers, total_questions) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    ON CONFLICT (user_id, passage_id, question_type) 
    DO UPDATE SET 
      score = EXCLUDED.score, 
      correct_answers = EXCLUDED.correct_answers, 
      total_questions = EXCLUDED.total_questions, 
      submitted_at = CURRENT_TIMESTAMP 
    RETURNING *
  `;
  const result = await pool.query(query, [userId, passageId, questionType, score, correctAnswers, totalQuestions]);
  return result.rows[0];
};

export const getResultsByUser = async (userId: number): Promise<Result[]> => {
  const query = 'SELECT * FROM results WHERE user_id = $1 ORDER BY submitted_at DESC';
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getResultByUserAndPassage = async (userId: number, passageId: number, questionType: number): Promise<Result | null> => {
  const query = 'SELECT * FROM results WHERE user_id = $1 AND passage_id = $2 AND question_type = $3 ORDER BY submitted_at DESC LIMIT 1';
  const result = await pool.query(query, [userId, passageId, questionType]);
  return result.rows[0] || null;
};

export const getResultsByUserAndType = async (userId: number, questionType: number): Promise<Result[]> => {
  const query = 'SELECT * FROM results WHERE user_id = $1 AND question_type = $2 ORDER BY submitted_at DESC';
  const result = await pool.query(query, [userId, questionType]);
  return result.rows;
};

export const initResultsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      passage_id INTEGER NOT NULL,
      question_type INTEGER NOT NULL CHECK (question_type IN (1,2,3,4)),
      score INTEGER,
      total_questions INTEGER,
      correct_answers INTEGER,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, passage_id, question_type)
    )
  `;
  await pool.query(query);
}; 