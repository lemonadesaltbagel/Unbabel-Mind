import { Router } from 'express';
import { 
  submitAnswer, 
  getAnswers, 
  getEssay, 
  getUserResults, 
  getUserResultsByType, 
  getResultsWithCorrectAnswers 
} from '../controllers/answerController';

const router = Router();

router.post('/submit', submitAnswer);
router.get('/:userId/:passageId/:questionType', getAnswers);
router.get('/essay/:userId/:passageId/:questionType', getEssay);
router.get('/results/:userId', getUserResults);
router.get('/results/:userId/:questionType', getUserResultsByType);
router.get('/review/:userId/:passageId/:questionType', getResultsWithCorrectAnswers);

export default router; 