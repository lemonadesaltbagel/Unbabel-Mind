import{SpeakingSubmission}from'@/types/speaking';
import{Question}from'@/types/reading';
export const lk=(id:string,type:string)=>`speaking-answers-${id}-${type}`;
export const ld=(id:string,type:string):Record<number,string[]>=>{const s=localStorage.getItem(lk(id,type));return s?JSON.parse(s):{};};
export const sv=(id:string,type:string,a:Record<number,string[]>):void=>{localStorage.setItem(lk(id,type),JSON.stringify(a));};
export const ldp=async(id:string,type:string):Promise<{title:string;content:string}>=>{try{const res=await fetch(`/static/speaking/${id}_${type}.txt`);const text=await res.text();const[tl,...rest]=text.split('\n');return{title:tl.trim(),content:rest.join('\n').trim()};}catch{return{title:'',content:'Failed to load speaking prompt.'};}};
export const ldq=async(id:string,type:string):Promise<Question[]>=>{try{const res=await fetch(`/static/speaking/${id}_${type}_q.json`);return await res.json();}catch{return[{type:'intro',text:'Failed to load questions.'}];}};
export const sub=async(pl:SpeakingSubmission):Promise<{ok:boolean;message:string}>=>{try{const res=await fetch('/api/submitAnswer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pl)});const result=await res.json();return{ok:res.ok,message:result.message||'Submission failed.'};}catch{return{ok:false,message:'Network error.'};}}; 