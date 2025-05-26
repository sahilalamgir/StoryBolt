import {  NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const { prompt, genre, pageCount } = await req.json();
        console.log(prompt);
        const aiPrompt = `Genre: ${genre}
        User prompt: ${prompt}
        
        Please output exactly ${pageCount} paragraphs (excluding the title) and nothing else.
        
        Make sure:
        - The first line begins with 'Title: ' followed by your chosen title.
        - There are two newline characters ('\\n\\n') between the title and paragraph 1, and between each pair of paragraphs.
        - You produce exactly ${pageCount} paragraphs — no more, no fewer.
        - Each paragraph is substantial (at least 3–5 sentences) and compelling.`
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(aiPrompt)}`);
        const story = response.data.split("\n\n");
        return NextResponse.json({ title: story[0].slice(7), paragraphs: story.slice(1) });
      } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: `Internal Server Error: ${err}` }, { status: 500 });
      }
}