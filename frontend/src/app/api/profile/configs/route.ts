import {NextResponse} from 'next/server';
import {loadOpenAIToken} from '@/utils/env';
export async function GET(){try{const openaiToken=loadOpenAIToken()||'';return NextResponse.json({openaiToken});}catch(e){console.error('Error loading configs:',e);return NextResponse.json({error:'Failed to load configurations'},{status:500});}}
