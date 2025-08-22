import {readFileSync,writeFileSync,existsSync} from 'fs';
import {join} from 'path';
export const loadOpenAIToken=()=>{try{const p=join(process.cwd(),'openai_token.txt');if(existsSync(p))return readFileSync(p,'utf8').trim();}catch(e){console.error('Error loading OpenAI token:',e);}return null;};
export const saveOpenAIToken=(token:string)=>{try{const p=join(process.cwd(),'openai_token.txt');writeFileSync(p,token,'utf8');return true;}catch(e){console.error('Error saving OpenAI token:',e);return false;}};
export const isTokenConfigured=()=>{const t=loadOpenAIToken();return t&&t.length>0&&t!=='your_openai_api_key_here';};
