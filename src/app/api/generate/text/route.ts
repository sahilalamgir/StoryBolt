import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, totalTimeoutMs = 33000) { // 33s to leave 2s buffer for Vercel's 35s limit
  const startTime = Date.now();
  let attempt = 0;
  let lastError;

  console.log(`🔍 Starting fetch to: ${url.substring(0, 100)}...`);
  console.log(`⏱️ Total timeout: ${totalTimeoutMs}ms (33s for 35s Vercel limit)`);

  while (Date.now() - startTime < totalTimeoutMs) {
    attempt++;
    const remainingTime = totalTimeoutMs - (Date.now() - startTime);
    
    const attemptStart = Date.now();
    try {
      console.log(`🔄 Text generation attempt ${attempt}, remaining time: ${Math.round(remainingTime/1000)}s`);
      
      const controller = new AbortController();
      // Give each attempt up to 20 seconds, but respect remaining time
      const timeoutId = setTimeout(() => {
        console.log(`⚠️ Aborting attempt ${attempt} due to timeout`);
        controller.abort();
      }, Math.min(remainingTime - 1000, 20000));

      console.log(`📡 Making fetch request... (attempt ${attempt})`);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'StoryBolt/1.0 (Vercel)',
          'Accept': 'application/json',
        }
      });
      
      const fetchTime = Date.now() - attemptStart;
      console.log(`📡 Fetch completed in ${fetchTime}ms (attempt ${attempt})`);

      clearTimeout(timeoutId);

      if (resp.ok) {
        console.log(`✅ Text generation succeeded on attempt ${attempt} after ${fetchTime}ms`);
        return resp;
      }

      const errorText = await resp.text();
      lastError = new Error(`HTTP ${resp.status}: ${errorText}`);
      console.error(`❌ Attempt ${attempt} failed with status ${resp.status} after ${fetchTime}ms`);
    } catch (err) {
      const attemptTime = Date.now() - attemptStart;
      lastError = err;
      console.error(`❌ Attempt ${attempt} failed after ${attemptTime}ms:`, err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        console.error(`⏰ Attempt ${attempt} timed out after ${attemptTime}ms`);
      }
    }

    // Short delay before retry, but only if we have enough time left
    if (Date.now() - startTime < totalTimeoutMs - 10000) { // Need 10s for next attempt
      console.log(`⏸️ Waiting 1s before retry...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw lastError || new Error('Text generation timed out after multiple attempts');
}

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log(`🚀 Text generation started at ${new Date().toISOString()}`);
  
  try {
    const parseStart = Date.now();
    const { prompt, genre, pageCount } = await req.json();
    console.log(`📝 Request parsed in ${Date.now() - parseStart}ms - Genre: ${genre}, Pages: ${pageCount}, Prompt length: ${prompt.length}`);

    const promptStart = Date.now();
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

    console.log(`📋 AI prompt prepared in ${Date.now() - promptStart}ms (length: ${aiPrompt.length} chars)`);
    
    const fetchStart = Date.now();
    const resp = await fetchWithRetry(
      `https://text.pollinations.ai/${encodeURIComponent(aiPrompt)}`
    );
    console.log(`🌐 Total fetch time: ${Date.now() - fetchStart}ms`);

    const parseJsonStart = Date.now();
    const data = await resp.json();
    console.log(`🔧 JSON parsing took: ${Date.now() - parseJsonStart}ms`);

    // Validate response structure
    if (!data.title || !data.paragraphs || !data.imagePrompts) {
      throw new Error("Invalid response structure from AI service");
    }

    console.log(`✅ Text generation completed in ${Date.now() - startTime}ms`);
    console.log(`📊 Story: "${data.title}" with ${data.paragraphs.length} paragraphs`);

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
