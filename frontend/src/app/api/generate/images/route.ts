import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import LZString from 'lz-string'
import pLimit from 'p-limit'

export async function POST(req: NextRequest) {
  try {
    const { allImagePrompts } = await req.json();
    // const imageUrls = allImagePrompts.map((imagePrompt: string) =>
    //     `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=turbo&width=512&height=512&nologo=true&safe=true`
    // );
    const images = await Promise.all(
      allImagePrompts.map(async (imagePrompt: string) => {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=turbo&width=512&height=512&nologo=true&safe=true`
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
