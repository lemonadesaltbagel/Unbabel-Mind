import{Question,Highlight,Answers,SubmissionPayload}from'@/types/reading';
export const lk=(id:string,type:string)=>`reading-answers-${id}-${type}`;
export const hlk=(id:string,type:string)=>`highlights-${id}-${type}`;
export const ld=(id:string,type:string):Answers=>{const s=localStorage.getItem(lk(id,type));return s?JSON.parse(s):{};};
export const sv=(id:string,type:string,a:Answers):void=>{localStorage.setItem(lk(id,type),JSON.stringify(a));};
export const ldh=(id:string,type:string):Highlight[]=>{const s=localStorage.getItem(hlk(id,type));return s?JSON.parse(s):[];};
export const svh=(id:string,type:string,h:Highlight[]):void=>{localStorage.setItem(hlk(id,type),JSON.stringify(h));};
export const ldp=async(id:string,type:string):Promise<{title:string;content:string}>=>{try{const res=await fetch(`/static/reading/${id}_${type}.txt`);const text=await res.text();const[tl,...rest]=text.split('\n');return{title:tl.trim(),content:rest.join('\n').trim()};}catch{return{title:'',content:'Failed to load passage.'};}};
export const ldq=async(id:string,type:string):Promise<Question[]>=>{try{const res=await fetch(`/static/reading/${id}_${type}_q.json`);return await res.json();}catch{return[{type:'intro',text:'Failed to load questions.'}];}};
export const lde=async(id:string,type:string):Promise<{number:number;text:string}[]>=>{try{const res=await fetch(`/static/reading/${id}_${type}_e.json`);return await res.json();}catch{return[];}};
export const sub=async(pl:SubmissionPayload):Promise<{ok:boolean;message:string}>=>{try{const res=await fetch('http://localhost:3001/api/answers/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pl)});const result=await res.json();return{ok:res.ok,message:result.message||'Submission failed.'};}catch{return{ok:false,message:'Submission error.'};}};
export const ldFromBackend=async(userId:number,passageId:number,questionType:number):Promise<Answers>=>{try{const res=await fetch(`http://localhost:3001/api/answers/${userId}/${passageId}/${questionType}`);if(!res.ok)return{};const result=await res.json();if(!result.success)return{};const answers:Answers={};result.data.forEach((a:{question_id:number;user_answer:string[]})=>{answers[a.question_id]=a.user_answer;});return answers;}catch{return{};}};
export const hs=(n:number,o:string,m:boolean,a:Answers):Answers=>{return{...a,[n]:m?(a[n]||[]).includes(o)?(a[n]||[]).filter(x=>x!==o):[...(a[n]||[]),o]:[o]};};
export const hf=(n:number,v:string,a:Answers):Answers=>{return{...a,[n]:[v]};}; 