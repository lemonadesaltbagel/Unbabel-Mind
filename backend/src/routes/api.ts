import {Router} from 'express';
import authRoutes from './auth';
const r=Router();
r.get('/health',(req,res)=>{res.json({status:'ok',timestamp:new Date().toISOString()});});
r.use('/auth',authRoutes);
export default r; 