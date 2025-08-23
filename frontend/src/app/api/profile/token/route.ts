import { NextRequest, NextResponse } from 'next/server';
import { saveOpenAIToken } from '@/utils/env';

const validateOpenAIToken = (token: string): { valid: boolean; error?: string } => {
  if (!token) return { valid: false, error: 'Token is required' };
  if (!token.startsWith('sk-')) return { valid: false, error: 'Token must start with "sk-"' };
  if (token.length < 20) return { valid: false, error: 'Token is too short' };
  if (token.length > 200) return { valid: false, error: 'Token is too long' };
  return { valid: true };
};

export async function POST(req: NextRequest) {
  try {
    const { openaiToken } = await req.json();
    const validation = validateOpenAIToken(openaiToken);
    
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    if (saveOpenAIToken(openaiToken)) {
      return NextResponse.json({ message: 'OpenAI token saved successfully' });
    }
    
    return NextResponse.json({ error: 'Failed to save OpenAI token' }, { status: 500 });
  } catch (error) {
    console.error('Error saving OpenAI token:', error);
    return NextResponse.json({ error: 'Failed to save OpenAI token' }, { status: 500 });
  }
}
