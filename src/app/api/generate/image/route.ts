import { NextRequest, NextResponse } from "next/server";

async function fetchWithRetry(url: string, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }

      const resp = await fetch(url, {
        signal: AbortSignal.timeout(15000), // 15 second timeout per image
      });

      if (resp.ok) {
        return await resp.arrayBuffer();
      }

      lastError = new Error(`HTTP ${resp.status}`);
    } catch (err) {
      lastError = err;
      console.error(`Image generation attempt ${attempt + 1} failed:`, err);
    }
  }

  throw lastError;
}

function getFallbackImage(prompt: string) {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#e5e7eb"/>
      <text x="50%" y="45%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle">Story Image</text>
      <text x="50%" y="55%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">${prompt.substring(0, 25)}...</text>
    </svg>`
  ).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { imagePrompt, artStyle, index } = await req.json();

    if (!imagePrompt || !artStyle) {
      return NextResponse.json(
        { error: "Missing imagePrompt or artStyle" },
        { status: 400 }
      );
    }

    console.log(`Generating image ${index + 1}: ${imagePrompt}`);

    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${imagePrompt} in ${artStyle} art style`)}?model=turbo&width=512&height=512&nologo=true&safe=true`;
      
      const data = await fetchWithRetry(url);
      const base64Image = `data:image/jpeg;base64,${Buffer.from(data).toString("base64")}`;
      
      return NextResponse.json({ 
        image: base64Image,
        index,
        success: true 
      });
    } catch (err) {
      console.error(`Failed to generate image ${index + 1}:`, err);
      
      // Return fallback image instead of failing
      return NextResponse.json({ 
        image: getFallbackImage(imagePrompt),
        index,
        success: false,
        error: err instanceof Error ? err.message : "Image generation failed"
      });
    }
  } catch (err) {
    console.error("Image API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
