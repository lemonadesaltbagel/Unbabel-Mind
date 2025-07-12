import {Request,Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {createUser,findUserByEmail,findUserById} from '../models/User';
export const register=async(req:Request,res:Response):Promise<void>=>{
try{
const {firstName,lastName,email,password}=req.body;
if(!firstName||!lastName||!email||!password){
res.status(400).json({error:'All fields are required'});
return;
}
const existingUser=await findUserByEmail(email);
if(existingUser){
res.status(400).json({error:'User already exists'});
return;
}
const user=await createUser(firstName,lastName,email,password);
const token=jwt.sign({userId:user.id},process.env.JWT_SECRET||'fallback-secret',{expiresIn:'24h'});
res.status(201).json({message:'User created successfully',token,user:{id:user.id.toString(),firstName:user.first_name,lastName:user.last_name,email:user.email}});
}catch(error){
console.error('Register error:',error);
res.status(500).json({error:'Internal server error'});
}
};
export const login=async(req:Request,res:Response):Promise<void>=>{
try{
const {email,password}=req.body;
if(!email||!password){
res.status(400).json({error:'Email and password are required'});
return;
}
const user=await findUserByEmail(email);
if(!user){
res.status(401).json({error:'Invalid credentials'});
return;
}
const isValidPassword=await bcrypt.compare(password,user.password);
if(!isValidPassword){
res.status(401).json({error:'Invalid credentials'});
return;
}
const token=jwt.sign({userId:user.id},process.env.JWT_SECRET||'fallback-secret',{expiresIn:'24h'});
res.json({message:'Login successful',token,user:{id:user.id.toString(),firstName:user.first_name,lastName:user.last_name,email:user.email}});
}catch(error){
console.error('Login error:',error);
res.status(500).json({error:'Internal server error'});
}
};
export const getProfile=async(req:Request,res:Response):Promise<void>=>{
try{
const authReq=req as any;
const userId=authReq.user?.userId;
if(!userId){
res.status(401).json({error:'User not authenticated'});
return;
}
const user=await findUserById(userId);
if(!user){
res.status(404).json({error:'User not found'});
return;
}
res.json({id:user.id.toString(),firstName:user.first_name,lastName:user.last_name,email:user.email});
}catch(error){
console.error('Get profile error:',error);
res.status(500).json({error:'Internal server error'});
}
}; 