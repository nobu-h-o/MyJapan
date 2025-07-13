import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAIクライアントを初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // リクエストボディからプロンプトとパラメータを取得
    const body = await request.json();
    const { prompt, max_tokens = 2000 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'プロンプトが必要です' },
        { status: 400 }
      );
    }

    // OpenAI APIにリクエストを送信
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'あなたは旅行プランナーです。ユーザーの旅行条件に基づいて、詳細な日本旅行のプランを提案してください。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: max_tokens,
      temperature: 0.7,
    });

    // レスポンスからテキストを抽出
    const text = response.choices[0]?.message?.content || '';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    return NextResponse.json(
      { error: error.message || 'APIリクエスト中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 