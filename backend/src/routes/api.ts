import {Router} from 'express';
import authRoutes from './auth';
import answerRoutes from './answers';
const r=Router();
r.get('/health',(req,res)=>{res.json({status:'ok',timestamp:new Date().toISOString()});});
r.use('/auth',authRoutes);
r.use('/answers',answerRoutes);
export default r; 