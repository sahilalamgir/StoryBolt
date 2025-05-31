"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/contexts/StoryContext";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/toast";

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
  const { user } = useUser();
  const { addToast } = useToast();

  const clamp = (n: number) => Math.min(20, Math.max(5, n));

  const generateStory = async () => {
    try {
      setLoading(true);

      const textData = await fetch("/api/generate/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, genre, pageCount }),
      });
      if (!textData.ok) {
        throw new Error(
          `Failed to generate text: HTTP ${
            textData.status
          }: ${await textData.text()}`
        );
      }
      const { title, paragraphs, imagePrompts } = await textData.json();

      const imageData = await fetch("/api/generate/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artStyle,
          allImagePrompts: [title, ...imagePrompts],
        }),
      });
      if (!imageData.ok) {
        throw new Error(
          `Failed to generate images: HTTP ${
            imageData.status
          }: ${await imageData.text()}`
        );
      }
      const { images } = await imageData.json();

      // Save the story to database and get book ID
      const storyData = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, paragraphs, images, genre }),
      });

      if (!storyData.ok) {
        throw new Error(
          `Failed to save story: HTTP ${
            storyData.status
          }: ${await storyData.text()}`
        );
      }

      const { bookId } = await storyData.json();

      // Set story in context for potential future use
      setStory({
        title,
        paragraphs,
        images,
        genre,
        stars: 0,
        authorId: user?.id ?? "",
        authorName: user?.fullName ?? "",
      });

      // Redirect to the individual story page
      router.push(`/story/${bookId}`);
    } catch (err) {
      console.error("Error generating story:", err);
      addToast("Error generating story. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left pane: prompt + button */}
      <div className="flex flex-col h-full">
        <textarea
          className="flex-1 border border-gray-300 rounded-md p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Enter your story prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
          {loading ? "Generating…" : "Generate Story"}
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
