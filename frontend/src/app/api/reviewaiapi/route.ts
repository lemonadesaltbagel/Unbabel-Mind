import { NextRequest, NextResponse } from 'next/server';
console.log('HF TOKEN:', process.env.HUGGINGFACE_API_TOKEN);
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/gemma-2-2b-it',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();

    // 👇 统一结构，确保前端可以稳拿到字段
    return NextResponse.json({
      generated_text: data[0]?.generated_text || '',
    });
  } catch (err) {
    console.error('Hugging Face API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}