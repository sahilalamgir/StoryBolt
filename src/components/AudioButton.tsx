"use client";

import { useCallback } from "react";
import { Button } from "./ui/button";
import { Headphones } from 'lucide-react';

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

  return <Button className="bg-gradient-to-r from-indigo-500 to-pink-500 font-bold py-3 px-8 rounded-xl shadow-md
        hover:shadow-lg 
        hover:from-indigo-600 
        hover:to-pink-600 
        active:from-indigo-700 
        active:to-pink-700 
        transition-all 
        duration-200" onClick={playAudio}>
          <Headphones /> Play Audio
          </Button>;
}
