import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/config';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const apiUrl = getBackendUrl() + '/api/answers/submit';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { message: result.message || 'Submission failed' }, 
        { status: response.status }
      );
    }
  } catch {
    return NextResponse.json({ message: 'Network error' }, { status: 500 });
  }
} 