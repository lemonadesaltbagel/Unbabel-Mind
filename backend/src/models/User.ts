import pool from '../config/database';
import bcrypt from 'bcryptjs';
export interface User{id:number;first_name:string;last_name:string;email:string;password:string;created_at:Date;}
export const createUser=async(f:string,l:string,e:string,p:string):Promise<User>=>{const h=await bcrypt.hash(p,10);const q='INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';const r=await pool.query(q,[f,l,e,h]);return r.rows[0];};
export const findUserByEmail=async(e:string):Promise<User|null>=>{const q='SELECT * FROM users WHERE email = $1';const r=await pool.query(q,[e]);return r.rows[0]||null;};
export const findUserById=async(i:number):Promise<User|null>=>{const q='SELECT * FROM users WHERE id = $1';const r=await pool.query(q,[i]);return r.rows[0]||null;};
export const initUsersTable=async():Promise<void>=>{const q=`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY,first_name VARCHAR(255) NOT NULL,last_name VARCHAR(255) NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;await pool.query(q);}; 