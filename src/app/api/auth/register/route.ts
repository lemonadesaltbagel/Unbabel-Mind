import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // 模拟注册成功
  return NextResponse.json({ message: 'Registered successfully', userId: 12345 });
}