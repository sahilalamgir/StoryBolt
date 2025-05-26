import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { paragraphs } = await req.json();
    // const imageUrls = paragraphs.map((paragraph: string) =>
    //     `https://image.pollinations.ai/prompt/${encodeURIComponent(paragraph)}?model=turbo&width=512&height=512&nologo=true`
    // );

    const images = await Promise.all(
        paragraphs.map(async (paragraph: string) => {
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(paragraph)}?model=turb&width=512&height=512&nologo=true`
          const resp = await axios.get(url, { responseType: 'arraybuffer' })
          return `data:image/jpeg;base64,${Buffer.from(resp.data).toString('base64')}`
        })
      )

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
