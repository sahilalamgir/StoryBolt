import {  NextResponse } from "next/server";

export async function POST(req: Request) {
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

Example of the exact shape (for a page count of 3):

\`\`\`json
{"title":"A Hero is Born","paragraphs":["First paragraph text here. Second sentence. Third sentence.","Second paragraph text here. Second sentence. Third sentence.","Third paragraph text here. Second sentence. Third sentence."],"imagePrompts":["A boy standing alone under a stormy sky.","A tall castle perched atop a snowy mountain.","A fierce dragon breathing flame over a village at dawn."]}`
        const resp = await fetch(`https://text.pollinations.ai/${encodeURIComponent(aiPrompt)}`);
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
        }
        console.log("resp", resp);
        const data = await resp.json();
        console.log("data", data);
        return NextResponse.json(data);
      } catch (err: unknown) {
        console.error(err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'An unknown error occurred' }, { status: 500 });
      }
}