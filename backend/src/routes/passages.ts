import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, (req, res) => {
  try {
    res.json([
      {
        id: 1,
        title: 'Sample Reading Passage',
        type: 'reading',
        content: 'This is a sample reading passage for testing purposes.'
      }
    ]);
  } catch (error) {
    console.error('Get passages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      id: parseInt(id),
      title: 'Sample Reading Passage',
      type: 'reading',
      content: 'This is a sample reading passage for testing purposes.'
    });
  } catch (error) {
    console.error('Get passage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/submit', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    res.json({
      success: true,
      message: 'Answers submitted successfully',
      passageId: parseInt(id)
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/progress', authenticateToken, (req, res) => {
  try {
    res.json({
      completedPassages: ['1'],
      totalPassages: 1,
      averageScore: 85
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
