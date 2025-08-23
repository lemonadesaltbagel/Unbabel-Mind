import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/config';

export async function GET(
  req: NextRequest, 
  { params }: { params: { userId: string; passageId: string; questionType: string } }
) {
  try {
    const paramsData = await params;
    const apiUrl = `${getBackendUrl()}/api/answers/review/${paramsData.userId}/${paramsData.passageId}/${paramsData.questionType}`;
    
    const response = await fetch(apiUrl, { method: 'GET' });
    
    if (!response.ok) {
      return NextResponse.json({ message: 'Backend error' }, { status: response.status });
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid response format' }, { status: 500 });
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: 'Network error' }, { status: 500 });
  }
}
