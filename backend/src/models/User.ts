import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
}

export const createUser = async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await pool.query(query, [firstName, lastName, email, hashedPassword]);
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updateUser = async (id: number, firstName: string, lastName: string, email: string): Promise<User> => {
  const query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *';
  const result = await pool.query(query, [firstName, lastName, email, id]);
  return result.rows[0];
};

export const initUsersTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
}; 