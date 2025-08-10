import{WritingSubmission,WritingRating,WritingRatingResponse,calculateWritingScore}from'@/types/writing';
export const ldp=async(id:string,type:string):Promise<{title:string;content:string}>=>{try{const res=await fetch(`/static/writing/${id}_${type}.txt`);const text=await res.text();const[tl,...rest]=text.split('\n');return{title:tl.trim(),content:rest.join('\n').trim()};}catch{return{title:'',content:'Failed to load writing prompt.'};}};
export const sub=async(pl:WritingSubmission):Promise<{ok:boolean;message:string}>=>{try{const res=await fetch('/api/submitAnswer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pl)});const result=await res.json();return{ok:res.ok,message:result.message||'Submission failed.'};}catch{return{ok:false,message:'Network error.'};}};
export const wc=(text:string):number=>text.split(' ').filter(word=>word.length>0).length;
export const getWritingRating=async(essay:string,prompt:string):Promise<WritingRatingResponse>=>{try{const p=`You are an expert IELTS writing examiner. Rate the following essay based on IELTS Writing Task 2 criteria. The essay is responding to this prompt: "${prompt}"

Essay: "${essay}"

Rate each criterion on a scale of 0-9 (minimum gap 0.5):
1. Task Achievement (0-9): How well the essay addresses the task requirements
2. Coherence & Cohesion (0-9): How well organized and connected the ideas are
3. Lexical Resource (0-9): Vocabulary range and accuracy
4. Grammatical Range & Accuracy (0-9): Grammar usage and sentence structure

Respond ONLY with a JSON object in this exact format:
{"taskAchievement": X.X, "coherenceCohesion": X.X, "lexicalResource": X.X, "grammaticalRangeAccuracy": X.X, "feedback": "Your detailed feedback here"}

Where X.X is a number from 0 to 9 with 0.5 increments (e.g., 6.0, 6.5, 7.0, etc.).`;
const res=await fetch('/api/reviewaiapi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});
if(!res.ok)throw new Error('Failed to get rating');
const data=await res.json();
const text=data.generated_text||'';
const jsonMatch=text.match(/\{[\s\S]*\}/);
if(!jsonMatch)throw new Error('Invalid response format');
const rating=JSON.parse(jsonMatch[0])as WritingRating;
const{taskAchievement,coherenceCohesion,lexicalResource,grammaticalRangeAccuracy,feedback}=rating;
const validRating={taskAchievement:Math.max(0,Math.min(9,Math.round(taskAchievement*2)/2)),coherenceCohesion:Math.max(0,Math.min(9,Math.round(coherenceCohesion*2)/2)),lexicalResource:Math.max(0,Math.min(9,Math.round(lexicalResource*2)/2)),grammaticalRangeAccuracy:Math.max(0,Math.min(9,Math.round(grammaticalRangeAccuracy*2)/2))};
const{averageScore,finalScore}=calculateWritingScore(validRating);
return{rating:validRating,averageScore,finalScore,feedback:feedback||'No feedback provided.'};}catch{return{rating:{taskAchievement:0,coherenceCohesion:0,lexicalResource:0,grammaticalRangeAccuracy:0},averageScore:0,finalScore:0,feedback:'Error getting rating.'};}}; 