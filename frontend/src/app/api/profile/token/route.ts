import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/config';

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

    const backendUrl = getBackendUrl();
    const authHeader = req.headers.get('authorization') || '';

    const response = await fetch(`${backendUrl}/api/profile/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ openaiToken }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying OpenAI token save:', error);
    return NextResponse.json({ error: 'Failed to save OpenAI token' }, { status: 500 });
  }
}
