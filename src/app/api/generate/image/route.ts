import { NextRequest, NextResponse } from "next/server";

async function fetchWithRetry(url: string, maxRetries = 3, totalTimeoutMs = 58000) { // 58s to leave 2s buffer for Vercel's 60s default
  const startTime = Date.now();
  let attempt = 0;
  let lastError;

  console.log(`🖼️ Starting image fetch: ${url.substring(0, 100)}...`);
  console.log(`⏱️ Total timeout: ${totalTimeoutMs}ms (58s for 60s Vercel default)`);

  while (attempt < maxRetries && Date.now() - startTime < totalTimeoutMs) {
    attempt++;
    const remainingTime = totalTimeoutMs - (Date.now() - startTime);
    
    const attemptStart = Date.now();
    try {
      if (attempt > 1) {
        console.log(`🔄 Image generation retry attempt ${attempt}, remaining time: ${Math.round(remainingTime/1000)}s`);
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * (attempt - 1), remainingTime / 4)));
      } else {
        console.log(`🔄 Image generation attempt ${attempt}, remaining time: ${Math.round(remainingTime/1000)}s`);
      }

      const controller = new AbortController();
      // Increased per-attempt timeout from 15s to 20s for more generous timing
      const timeoutId = setTimeout(() => {
        console.log(`⚠️ Aborting image attempt ${attempt} due to timeout`);
        controller.abort();
      }, Math.min(remainingTime - 500, 20000));

      console.log(`📡 Making image fetch request... (attempt ${attempt})`);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'StoryBolt/1.0 (Vercel)',
          'Accept': 'image/*',
        }
      });

      const fetchTime = Date.now() - attemptStart;
      console.log(`📡 Image fetch completed in ${fetchTime}ms (attempt ${attempt})`);

      clearTimeout(timeoutId);

      if (resp.ok) {
        console.log(`✅ Image generation succeeded on attempt ${attempt} after ${fetchTime}ms`);
        return await resp.arrayBuffer();
      }

      lastError = new Error(`HTTP ${resp.status}`);
      console.error(`❌ Image attempt ${attempt} failed with status ${resp.status} after ${fetchTime}ms`);
    } catch (err) {
      const attemptTime = Date.now() - attemptStart;
      lastError = err;
      console.error(`❌ Image generation attempt ${attempt} failed after ${attemptTime}ms:`, err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        console.error(`⏰ Image attempt ${attempt} timed out after ${attemptTime}ms`);
      }
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
