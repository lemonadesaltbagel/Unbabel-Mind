import{NextRequest,NextResponse}from'next/server';import{getBackendUrl}from'@/utils/config';
export async function GET(req:NextRequest,{params}:{params:{userId:string;passageId:string;questionType:string}}){
try{
const p=await params;
const apiUrl=`${getBackendUrl()}/api/answers/essay/${p.userId}/${p.passageId}/${p.questionType}`;
const r=await fetch(apiUrl,{method:'GET'});
if(!r.ok)return NextResponse.json({message:'Backend error'},{status:r.status});
const contentType=r.headers.get('content-type');
if(!contentType||!contentType.includes('application/json'))return NextResponse.json({message:'Invalid response format'},{status:500});
const result=await r.json();
return NextResponse.json(result);
}catch{
return NextResponse.json({message:'Network error'},{status:500});
}
}
