import {Router} from 'express';
import {submitAnswer,getAnswers,getEssay,getUserResults,getUserResultsByType} from '../controllers/answerController';
const r=Router();
r.post('/submit',submitAnswer);
r.get('/:userId/:passageId/:questionType',getAnswers);
r.get('/essay/:userId/:passageId/:questionType',getEssay);
r.get('/results/:userId',getUserResults);
r.get('/results/:userId/:questionType',getUserResultsByType);
export default r; 