import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/configs', authenticateToken, (req, res) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    res.json({ openaiToken: process.env.OPENAI_API_KEY || '' });
  } catch (error) {
    console.error('Get configs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/token', authenticateToken, (req, res) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const { openaiToken } = req.body;
    
    if (!openaiToken) {
      res.status(400).json({ error: 'OpenAI token is required' });
      return;
    }
    
    process.env.OPENAI_API_KEY = openaiToken;
    res.json({ message: 'Token updated successfully' });
  } catch (error) {
    console.error('Update token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
