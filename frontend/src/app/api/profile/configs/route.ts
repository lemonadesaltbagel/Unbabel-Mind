import { NextResponse } from 'next/server';
import { loadOpenAIToken } from '@/utils/env';

export async function GET() {
  try {
    const openaiToken = loadOpenAIToken() || '';
    return NextResponse.json({ openaiToken });
  } catch (error) {
    console.error('Error loading configs:', error);
    return NextResponse.json({ error: 'Failed to load configurations' }, { status: 500 });
  }
}
