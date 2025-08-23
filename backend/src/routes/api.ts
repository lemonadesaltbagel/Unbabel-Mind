import { Router } from 'express';
import authRoutes from './auth';
import answerRoutes from './answers';
import profileRoutes from './profile';
import reviewAIRoutes from './reviewAI';
import passageRoutes from './passages';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

router.use('/auth', authRoutes);
router.use('/answers', answerRoutes);
router.use('/profile', profileRoutes);
router.use('/reviewaiapi', reviewAIRoutes);
router.use('/passages', passageRoutes);

export default router; 