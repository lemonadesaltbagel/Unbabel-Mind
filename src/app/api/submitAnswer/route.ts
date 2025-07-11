// src/app/api/submitAnswer/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { passageId, userId, answers } = body;

    // 简单校验
    if (!passageId || !userId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'INVALID_DATA', message: 'Invalid submission format.' }, { status: 400 });
    }

    // 模拟写入数据库（你可以换成真正的 DB 写入逻辑）
    console.log('Received submission:');
    console.log('Passage ID:', passageId);
    console.log('User ID:', userId);
    console.log('Answers:', answers);

    // 返回成功响应
    return NextResponse.json({ message: 'Submission received.' }, { status: 200 });

  } catch (err) {
    console.error('Error parsing submission:', err);
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Could not process submission.' }, { status: 500 });
  }
}