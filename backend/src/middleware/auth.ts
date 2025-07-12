import {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
export interface AuthRequest extends Request{user?:{userId:number};}
export const authenticateToken=(req:AuthRequest,res:Response,next:NextFunction):void=>{const a=req.headers['authorization'];const t=a&&a.split(' ')[1];if(!t){res.status(401).json({error:'Access token required'});return;}jwt.verify(t,process.env.JWT_SECRET||'fallback-secret',(e:any,u:any)=>{if(e){res.status(403).json({error:'Invalid or expired token'});return;}req.user=u;next();});}; 