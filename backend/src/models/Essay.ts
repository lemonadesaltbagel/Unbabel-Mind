import pool from '../config/database';

export interface Essay {
  id: number;
  user_id: number;
  passage_id: number;
  question_type: number;
  essay_text: string;
  created_at: Date;
}

export const createEssay = async (userId: number, passageId: number, questionType: number, essayText: string): Promise<Essay> => {
  const query = 'INSERT INTO essays (user_id, passage_id, question_type, essay_text) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await pool.query(query, [userId, passageId, questionType, essayText]);
  return result.rows[0];
};

export const getEssayByUserAndPassage = async (userId: number, passageId: number, questionType: number): Promise<Essay | null> => {
  const query = 'SELECT * FROM essays WHERE user_id = $1 AND passage_id = $2 AND question_type = $3 ORDER BY created_at DESC LIMIT 1';
  const result = await pool.query(query, [userId, passageId, questionType]);
  return result.rows[0] || null;
};

export const initEssaysTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS essays (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      passage_id INTEGER NOT NULL,
      question_type INTEGER NOT NULL,
      essay_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
}; 