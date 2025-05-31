"use client";

import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Headphones } from "lucide-react";
import { useToast } from "./ui/toast";

// module-level variable to hold the one active Audio
let currentAudio: HTMLAudioElement | null = null;

export default function AudioButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const playAudio = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1) If there's already an audio playing, stop it
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        // optional: revoke URL if you want to free memory
        URL.revokeObjectURL(currentAudio.src);
        currentAudio = null;
      }

      const encodedText = encodeURIComponent(
        `Say the following exactly: ${text}`
      );
      const params = new URLSearchParams({
        model: "openai-audio",
        voice: "nova",
      });
      const url = `https://text.pollinations.ai/${encodedText}?${params}`;

      const resp = await fetch(url);

      if (!resp.ok) {
        if (resp.status === 400) {
          // Handle Azure OpenAI policy violations
          addToast(
            "Audio cannot be played due to content policy restrictions.",
            "warning"
          );
          return;
        } else {
          throw new Error(
            `Failed to generate audio: HTTP ${
              resp.status
            }: ${await resp.text()}`
          );
        }
      }

      if (!resp.headers.get("Content-Type")?.includes("audio/mpeg")) {
        throw new Error("API did not return audio/mpeg");
      }

      const blob = await resp.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      currentAudio = audio;

      // 5) When it ends, clear our reference
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
        if (currentAudio === audio) {
          currentAudio = null;
        }
      });
    } catch (err) {
      console.error("Audio generation error:", err);
      addToast("Failed to generate audio. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [text, addToast]);

  return (
    <Button
      className="bg-gradient-to-r from-indigo-500 to-pink-500 font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-600 
        hover:to-pink-600 
        active:from-indigo-700 
        active:to-pink-700 
        transition-all 
        duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={playAudio}
      disabled={isLoading}
    >
      <Headphones />
      {isLoading ? "Loading..." : "Play Audio"}
    </Button>
  );
}
