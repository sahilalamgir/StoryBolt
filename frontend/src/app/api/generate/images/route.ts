import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import LZString from 'lz-string'
import pLimit from 'p-limit'

export async function POST(req: NextRequest) {
  try {
    const { imagePrompts } = await req.json();
    const imageUrls = imagePrompts.map((imagePrompt: string) =>
        `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=turbo&width=512&height=512&nologo=true`
    );
    // console.log(imagePrompts);

    // const limit = pLimit(5);

    // const images = await Promise.all(
    //     imagePrompts.map((imagePrompt: string) => { 
    //         limit(async () => { 
    //             const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=turbo&width=512&height=512&nologo=true`;
    //             const resp = await axios.get(url, { responseType: 'arraybuffer' });
    //             const b64 = Buffer.from(resp.data).toString('base64');
    //             const compressed = LZString.compressToBase64(b64);
    //             return compressed;
    //         })
    //     })
    // );

    return NextResponse.json({ imageUrls });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
