import {Router} from 'express';
import {authenticateToken} from '../middleware/auth';
const r=Router();
r.get('/configs',authenticateToken,(req,res)=>{try{const r=req as any;const u=r.user?.userId;if(!u){res.status(401).json({error:'User not authenticated'});return;}res.json({openaiToken:process.env.OPENAI_API_KEY||''});}catch(e){console.error('Get configs error:',e);res.status(500).json({error:'Internal server error'});}});
r.post('/token',authenticateToken,(req,res)=>{try{const r=req as any;const u=r.user?.userId;if(!u){res.status(401).json({error:'User not authenticated'});return;}const {openaiToken}=req.body;if(!openaiToken){res.status(400).json({error:'OpenAI token is required'});return;}process.env.OPENAI_API_KEY=openaiToken;res.json({message:'Token updated successfully'});}catch(e){console.error('Update token error:',e);res.status(500).json({error:'Internal server error'});}});
export default r;
