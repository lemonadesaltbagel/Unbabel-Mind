import {Router} from 'express';
import authRoutes from './auth';
const router=Router();
router.get('/health',(req,res)=>{res.json({status:'ok',timestamp:new Date().toISOString()});});
router.use('/auth',authRoutes);
export default router; 