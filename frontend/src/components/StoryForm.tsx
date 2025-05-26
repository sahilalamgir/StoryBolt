"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useStory } from "@/contexts/StoryContext";
import LZString from 'lz-string';

const GENRES = ["Fantasy", "Sci-Fi", "Mystery", "Romance"];

const StoryForm = () => {
    const router = useRouter();
    const { setStory } = useStory();
    const [prompt, setPrompt] = useState<string>("");
    const [genre, setGenre] = useState<typeof GENRES[number]>("Fantasy");
    const [pageCount, setPageCount] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);

    const generateStory = useCallback(async () => {
        try {
          setLoading(true);
    
          const { data: textData } = await axios.post('/api/generate/text', { prompt, genre, pageCount }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const { title, paragraphs, imagePrompts } = textData;
          console.log(title);
          console.log(paragraphs);
          console.log(imagePrompts);
    
          const { data: imageData } = await axios.post("/api/generate/images", { allImagePrompts: [title, ...imagePrompts] });
          console.log("HEREREERER", imageData);

          const images = imageData.images;

          // const images = await Promise.all(
          //   imageData.imageUrls.map(async (imageUrl: string) => {
          //     const response = await axios.get(imageUrl, { responseType: "blob" })
          //     return URL.createObjectURL(response.data);
          //   })
          // );

          console.log("in here", images);
        
    
          setStory({
            title, 
            paragraphs, 
            images, 
            genre, 
          });
    
          router.push("/story");
        } catch (err) {
          console.error("Error generating story:", err);
        } finally {
            setLoading(false);
        }
      }, [prompt, genre, pageCount, setStory, router]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {/* Prompt */}
      <textarea
        className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full h-40 resize-none"
        placeholder="Enter your story prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Genre & Pages row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* Genre */}
        <fieldset className="flex items-center space-x-3">
          <legend className="font-medium">Genre:</legend>
          {GENRES.map((g) => (
            <label key={g} className="inline-flex items-center space-x-1">
              <input
                type="radio"
                name="genre"
                value={g}
                checked={genre === g}
                onChange={() => setGenre(g)}
                className="h-4 w-4 text-indigo-600 border-gray-300"
              />
              <span>{g}</span>
            </label>
          ))}
        </fieldset>

        {/* Page Count */}
        <div className="flex items-center space-x-2">
          <label htmlFor="pageCount" className="font-medium">
            Page(s):
          </label>
          <input
            id="pageCount"
            type="number"
            min={1}
            max={20}
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value) | 1)}
            className="border-2 border-gray-300 rounded-md p-2 w-20 text-center"
          />
        </div>
      </div>

      {/* Generate Button */}
      {loading ? (
        <button
          disabled
          className="bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl text-lg"
        >
          Generating…
        </button>
      ) : (
        <button
          onClick={generateStory}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform transition hover:-translate-y-1 text-lg"
        >
          Generate Story
        </button>
      )}
    </div>
  )
}

export default StoryForm