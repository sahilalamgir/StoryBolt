// testing.js
import fs from "fs";
import fetch from "node-fetch";        // If you're on Node 18+ you can use global fetch

async function generateAudioGet(text, voice = "alloy") {
  const encodedText = encodeURIComponent(text);
  const params = new URLSearchParams({ model: "openai-audio", voice });
  const url = `https://text.pollinations.ai/${encodedText}?${params}`;
  console.log("Fetching:", url);

  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  // pull out the raw ArrayBuffer and write to disk
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync("out.mp3", buffer);
  console.log("Wrote out.mp3 — now play it with your favorite player!");
}

generateAudioGet("Say the following exactly: This runs in Node!", "shimmer").catch(console.error);
