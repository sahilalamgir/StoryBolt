import { NextRequest, NextResponse } from "next/server";

async function fetchWithRetry(url: string, maxRetries = 3, totalTimeoutMs = 23000) { // 23s total
  const startTime = Date.now();
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries && Date.now() - startTime < totalTimeoutMs) {
    attempt++;
    const remainingTime = totalTimeoutMs - (Date.now() - startTime);
    
    if (remainingTime < 3000) break; // Need at least 3s for an attempt
    
    try {
      if (attempt > 1) {
        console.log(`Image generation retry attempt ${attempt}`);
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * (attempt - 1), remainingTime / 4)));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Math.min(remainingTime - 500, 10000)); // Max 10s per attempt

      const resp = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (resp.ok) {
        return await resp.arrayBuffer();
      }

      lastError = new Error(`HTTP ${resp.status}`);
    } catch (err) {
      lastError = err;
      console.error(`Image generation attempt ${attempt} failed:`, err);
    }
  }

  throw lastError || new Error('Image generation failed after retries');
}

function getFallbackImage(prompt: string) {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#e5e7eb"/>
      <text x="50%" y="45%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle">Story Image</text>
      <text x="50%" y="55%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}</text>
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
