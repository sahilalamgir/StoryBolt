import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, totalTimeoutMs = 23000) { // 23s to leave 2s buffer for Vercel
  const startTime = Date.now();
  let attempt = 0;
  let lastError;

  while (Date.now() - startTime < totalTimeoutMs) {
    attempt++;
    const remainingTime = totalTimeoutMs - (Date.now() - startTime);
    
    if (remainingTime < 5000) break; // Need at least 5s for an attempt
    
    try {
      console.log(`Text generation attempt ${attempt}, remaining time: ${Math.round(remainingTime/1000)}s`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Math.min(remainingTime - 1000, 15000)); // Max 15s per attempt

      const resp = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (resp.ok) {
        console.log(`Text generation succeeded on attempt ${attempt}`);
        return resp;
      }

      lastError = new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      console.error(`Attempt ${attempt} failed:`, lastError);
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt} failed:`, err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        console.error(`Attempt ${attempt} timed out`);
      }
    }

    // Short delay before retry, but only if we have time
    if (Date.now() - startTime < totalTimeoutMs - 2000) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw lastError || new Error('Text generation timed out after multiple attempts');
}

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log(`🚀 Text generation started at ${new Date().toISOString()}`);
  
  try {
    const { prompt, genre, pageCount } = await req.json();
    console.log(prompt, genre, pageCount);

    const aiPrompt = `Genre: ${genre}
User prompt: ${prompt}

Return only valid JSON. The JSON object must have exactly three keys:

1. "title": a single string that describes the story.  
2. "paragraphs": an array of exactly ${pageCount} strings (each paragraph must be enclosed in double quotes, and be 3 to 5 sentences long).  
3. "imagePrompts": an array of exactly ${pageCount} strings (each a single, vivid sentence, enclosed in double quotes, describing an image for the corresponding paragraph).

Do NOT output any code fences (\`\`\`), Markdown, comments, ellipses, or extra text.  
Do NOT use single quotes (only standard JSON double quotes).  
Do NOT include trailing commas.
Do NOT generate any NSFW content.
Do NOT forget to include all of the braces ({}) and square brackets ([]).
When using apostrophes in the title and paragraphs, ONLY use straight apostrophes (').

Example of the exact shape (for a page count of 3):

\`\`\`json
{
  "title": "A Hero is Born",
  "paragraphs": [
    "First paragraph text here. Second sentence. Third sentence.",
    "Second paragraph text here. Second sentence. Third sentence.",
    "Third paragraph text here. Second sentence. Third sentence."
  ],
  "imagePrompts": [
    "A boy standing alone under a stormy sky.",
    "A tall castle perched atop a snowy mountain.",
    "A fierce dragon breathing flame over a village at dawn."
  ]
}`;
    const resp = await fetchWithRetry(
      `https://text.pollinations.ai/${encodeURIComponent(aiPrompt)}`
    );

    const data = await resp.json();

    // Validate response structure
    if (!data.title || !data.paragraphs || !data.imagePrompts) {
      throw new Error("Invalid response structure from AI service");
    }
    console.log(data);

    console.log(`✅ Text generation completed in ${Date.now() - startTime}ms`);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`❌ Text generation failed after ${Date.now() - startTime}ms:`, err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
