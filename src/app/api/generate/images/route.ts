import { NextRequest, NextResponse } from 'next/server';

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry failed requests
async function fetchWithRetry(url: string, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add increasing delay between retries
      if (attempt > 0) {
        await delay(delayMs * attempt);
      }
      
      const resp = await fetch(url, { 
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (resp.ok) {
        return await resp.arrayBuffer();
      }
      
      lastError = new Error(`HTTP ${resp.status}: ${await resp.text()}`);
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt + 1} failed:`, err);
    }
  }
  
  throw lastError;
}

// Fallback image function
function getFallbackImage(prompt: string) {
  // Return a base64 encoded placeholder image or another service
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
        Image generation failed
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="18" fill="#888" text-anchor="middle">
        ${prompt.substring(0, 30)}...
      </text>
    </svg>
  `).toString('base64')}`;
}

export async function POST(req: NextRequest) {
  try {
    const { artStyle, allImagePrompts } = await req.json();
    
    const images = [];
    
    // Process images sequentially with a delay between requests
    for (let i = 0; i < allImagePrompts.length; i++) {
      const imagePrompt = allImagePrompts[i];
      try {
        // Add a small delay between requests to avoid overwhelming the service
        if (i > 0) await delay(500);
        
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${imagePrompt} in ${artStyle} art style`)}?model=turbo&width=512&height=512&nologo=true&safe=true`;
        
        // Try to fetch with retry logic
        const data = await fetchWithRetry(url);
        images.push(`data:image/jpeg;base64,${Buffer.from(data).toString('base64')}`);
        console.log("images", images.map(i => i.substring(0, 100)));
        console.log("images", images.length);
        
        console.log(`Generated image ${i+1}/${allImagePrompts.length}`);
      } catch (error) {
        console.error(`Failed to generate image ${i+1}:`, error);
        // Use a fallback for failed images
        images.push(getFallbackImage(imagePrompt));
      }
    }
    console.log("images", typeof images, images.length);
    
    
    return NextResponse.json({ images: images });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'An unknown error occurred' }, { status: 500 });
  }
}
