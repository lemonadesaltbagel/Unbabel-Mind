import{useEffect,useState,useRef}from'react';
export function useTimer(){
const[ts,setTs]=useState(0);
const[tr,setTr]=useState(false);
const trs=useRef(false);
useEffect(()=>{setTs(0);setTr(false);trs.current=false;},[]);
useEffect(()=>{if(tr){const i=setInterval(()=>{setTs(prev=>prev+1);},1000);return()=>clearInterval(i);}},[tr]);
useEffect(()=>{const st=()=>{if(!trs.current){setTr(true);trs.current=true;}};document.addEventListener('scroll',st,true);document.addEventListener('click',st);return()=>{document.removeEventListener('scroll',st,true);document.removeEventListener('click',st);};},[]);
const tm=`${Math.floor(ts/60).toString().padStart(2,'0')}:${(ts%60).toString().padStart(2,'0')}`;
return{ts,tr,tm};
}
