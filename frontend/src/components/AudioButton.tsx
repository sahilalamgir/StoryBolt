"use client";

import { useCallback } from "react";
import { Button } from "./ui/button";

export default function AudioButton({ text }: { text: string }) {
  const playAudio = useCallback(async () => {
      const encodedText = encodeURIComponent(`Say the following exactly: ${text}`);
      const params = new URLSearchParams({
        model: "openai-audio",
        voice: "nova",
      });
      const url = `https://text.pollinations.ai/${encodedText}?${params}`;

      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      }
      if (!resp.headers.get("Content-Type")?.includes("audio/mpeg")) {
        throw new Error("API did not return audio/mpeg");
      }
      const blob = await resp.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    }, [text]);

  return <Button className='hover:opacity-70 active:opacity-40' onClick={playAudio}>🎧 Play Audio</Button>;
}
