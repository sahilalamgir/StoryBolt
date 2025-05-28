import {  NextResponse } from "next/server";
import axios from "axios";

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

Example of the exact shape (for a page count of 3):

\`\`\`json
{"title":"A Hero is Born","paragraphs":["First paragraph text here. Second sentence. Third sentence.","Second paragraph text here. Second sentence. Third sentence.","Third paragraph text here. Second sentence. Third sentence."],"imagePrompts":["A boy standing alone under a stormy sky.","A tall castle perched atop a snowy mountain.","A fierce dragon breathing flame over a village at dawn."]}
`
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(aiPrompt)}`);
        console.log(response.data);
        return NextResponse.json(response.data);
      } catch (err: unknown) {
        console.error(err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'An unknown error occurred' }, { status: 500 });
      }
}