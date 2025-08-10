import {NextRequest,NextResponse} from 'next/server';

export async function POST(req:NextRequest){
  try{
    const d=await req.json();

    const apiUrl = 'http://backend:3001/api/answers/submit';
    
    const r=await fetch(apiUrl,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(d)
    });
    const result=await r.json();
    if(r.ok){
      return NextResponse.json(result);
    }else{
      return NextResponse.json({message:result.message||'Submission failed'},{status:r.status});
    }
  }catch{
    return NextResponse.json({message:'Network error'},{status:500});
  }
} 