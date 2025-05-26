import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { paragraphs } = await req.json();
    console.log(paragraphs);
    const imageUrls = paragraphs.map((paragraph: string) =>
        `https://image.pollinations.ai/prompt/${encodeURIComponent(paragraph)}?model=turbo`
    )

    return NextResponse.json({ imageUrls });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
