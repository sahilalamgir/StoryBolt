"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/contexts/StoryContext";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/toast";

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Comedy",
  "Action",
  "Adventure",
  "Horror",
  "Drama",
  "Fairy Tale",
] as const;
const ART_STYLES = [
  "Realistic",
  "Cartoon",
  "Cyberpunk",
  "Anime",
  "Folk",
  "Watercolor",
  "Pixel",
  "Sketch",
  "Oil",
  "Paper Cutout",
] as const;

export default function StoryForm() {
  const router = useRouter();
  const { setStory } = useStory();
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState<(typeof GENRES)[number]>("Fantasy");
  const [artStyle, setArtStyle] =
    useState<(typeof ART_STYLES)[number]>("Realistic");
  const [pageCount, setPageCount] = useState(10);
  const [inputValue, setInputValue] = useState(String(10));
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [imageProgress, setImageProgress] = useState({ current: 0, total: 0 });
  const { user } = useUser();
  const { addToast } = useToast();

  const clamp = (n: number) => Math.min(10, Math.max(5, n));

  const generateStory = async () => {
    try {
      setLoading(true);
      setLoadingStep("Generating text...");

      // Step 1: Generate text
      const textData = await fetch("/api/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genre, pageCount }),
      });

      if (!textData.ok) {
        throw new Error(`Failed to generate text: HTTP ${textData.status}`);
      }

      const { title, paragraphs, imagePrompts } = await textData.json();

      // Step 2: Generate images sequentially
      setLoadingStep("Generating images...");
      const allImagePrompts = [title, ...imagePrompts];
      setImageProgress({ current: 0, total: allImagePrompts.length });

      const images: string[] = new Array(allImagePrompts.length);

      // Generate images with a small delay between requests
      for (let i = 0; i < allImagePrompts.length; i++) {
        setImageProgress({ current: i + 1, total: allImagePrompts.length });

        try {
          const imageResponse = await fetch("/api/generate/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imagePrompt: allImagePrompts[i],
              artStyle,
              index: i,
            }),
          });

          if (imageResponse.ok) {
            const { image, success } = await imageResponse.json();
            images[i] = image;

            if (!success) {
              addToast(`Image ${i + 1} used fallback.`, "warning");
            }
          } else {
            // Fallback for failed request
            addToast(`Image ${i + 1} request failed.`, "error");
            images[i] = createFallbackImage(allImagePrompts[i]);
          }
        } catch (err) {
          void err;
          addToast(`Image ${i + 1} generation error.`, "error");
          images[i] = createFallbackImage(allImagePrompts[i]);
        }

        // Small delay to be nice to the API
        if (i < allImagePrompts.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Step 3: Save story
      setLoadingStep("Saving story...");
      const storyData = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, paragraphs, images, genre }),
      });

      if (!storyData.ok) {
        throw new Error(`Failed to save story: HTTP ${storyData.status}`);
      }

      const { bookId } = await storyData.json();

      // Set story in context
      setStory({
        title,
        paragraphs,
        images,
        genre,
        stars: 0,
        authorId: user?.id ?? "",
        authorName: user?.fullName ?? "",
      });

      // Redirect to story
      router.push(`/story/${bookId}`);
    } catch (err) {
      void err;
      setLoadingStep("Generation failed. Please try again.");
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const createFallbackImage = (prompt: string) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#e5e7eb"/>
        <text x="50%" y="45%" font-family="Arial" font-size="20" fill="#6b7280" text-anchor="middle">Story Image</text>
        <text x="50%" y="55%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle">${prompt.substring(
          0,
          50
        )}${prompt.length > 50 ? "..." : ""}</text>
      </svg>`
    ).toString("base64")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left pane */}
      <div className="flex flex-col h-full">
        <textarea
          className="flex-1 border border-gray-300 rounded-md p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Enter your story prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={generateStory}
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-md text-lg transition ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <span>{loadingStep}</span>
              {imageProgress.total > 0 && (
                <span className="text-sm">
                  Images: {imageProgress.current}/{imageProgress.total}
                </span>
              )}
            </div>
          ) : (
            "Generate Story"
          )}
        </button>
      </div>

      {/* Right pane: controls */}
      <div className="flex flex-col justify-between h-full space-y-6">
        {/* Genre */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Genre</legend>
          <div className="flex flex-wrap gap-3">
            {GENRES.map((g) => (
              <label key={g} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="genre"
                  value={g}
                  checked={genre === g}
                  onChange={() => setGenre(g)}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Art Style */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Art Style</legend>
          <div className="flex flex-wrap gap-3">
            {ART_STYLES.map((a) => (
              <label key={a} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="artStyle"
                  value={a}
                  checked={artStyle === a}
                  onChange={() => setArtStyle(a)}
                  disabled={loading}
                  className="h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="text-gray-700">{a}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Page Count */}
        <div>
          <label htmlFor="pageCount" className="block text-sm font-medium mb-1">
            Pages
          </label>
          <input
            id="pageCount"
            type="number"
            min={5}
            max={20}
            value={inputValue}
            disabled={loading}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setInputValue(raw);
            }}
            onBlur={() => {
              let n = parseInt(inputValue, 10);
              if (isNaN(n)) n = pageCount;
              n = clamp(n);
              setPageCount(n);
              setInputValue(String(n));
            }}
            className="w-24 border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>
    </div>
  );
}
