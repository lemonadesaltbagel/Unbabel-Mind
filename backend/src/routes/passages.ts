import {Router} from 'express';
import {authenticateToken} from '../middleware/auth';
const r=Router();
r.get('/',authenticateToken,(req,res)=>{try{res.json([{id:1,title:'Sample Reading Passage',type:'reading',content:'This is a sample reading passage for testing purposes.'}]);}catch(e){console.error('Get passages error:',e);res.status(500).json({error:'Internal server error'});}});
r.get('/:id',authenticateToken,(req,res)=>{try{const {id}=req.params;res.json({id:parseInt(id),title:'Sample Reading Passage',type:'reading',content:'This is a sample reading passage for testing purposes.'});}catch(e){console.error('Get passage error:',e);res.status(500).json({error:'Internal server error'});}});
r.post('/:id/submit',authenticateToken,(req,res)=>{try{const {id}=req.params;const {answers}=req.body;res.json({success:true,message:'Answers submitted successfully',passageId:parseInt(id)});}catch(e){console.error('Submit answer error:',e);res.status(500).json({error:'Internal server error'});}});
r.get('/progress',authenticateToken,(req,res)=>{try{res.json({completedPassages:['1'],totalPassages:1,averageScore:85});}catch(e){console.error('Get progress error:',e);res.status(500).json({error:'Internal server error'});}});
export default r;
