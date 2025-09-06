import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/config';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = req.headers.get('authorization') || '';

    const response = await fetch(`${backendUrl}/api/profile/configs`, {
      method: 'GET',
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying profile configs:', error);
    return NextResponse.json({ error: 'Failed to load configurations' }, { status: 500 });
  }
}
