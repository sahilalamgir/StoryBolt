"use client";

import { useState } from "react";
import axios from "axios";

interface Story {
  lines: string[];
  pictures: string[];
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [story, setStory] = useState<Story>({
    lines: [],
    pictures: [],
  });
  // const [loading, setLoading] = useState<boolean>(false);

  const generateLines = async () => {
    try {
      const response = await axios.post("http://0.0.0.0:8000/generate", {
          prompt: message,
      });

      console.log(response.data.generated_text);

      return response.data.generated_text.split("\n\n");
    } catch (err) {
      console.error("Error generating story lines:", err);
    }
  };

  const generatePictures = async (lines: string[]) => {
    const pictures = [];

    for (const line of lines) {
      try {
        // const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(storyLine)}`, {
        //   responseType: 'blob',
        // });

        // const imageUrl = URL.createObjectURL(response.data);

        const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(line)}`);
        if (!response.ok) {
          const errorText = await response.text(); // Get error details if possible
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        console.log("picture below url:");
        console.log(imageUrl);
        console.log("picture above url:");

        pictures.push(imageUrl);
      } catch (err) {
        console.error("Error generating story pictures:", err);
      }
    };

    return pictures;
  };

  const generateStory = async () => {
    const lines = await generateLines();
    const pictures = await generatePictures(lines);

    setStory({
      lines,
      pictures,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="flex flex-col items-center justify-center w-1/2">
        <textarea 
          className="border-2 border-gray-300 rounded-md p-2 mb-2 w-full resize-none" 
          placeholder="Enter your story prompt" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button className="bg-blue-500 text-white p-2 m-2 rounded-md" onClick={() => {generateStory()}}>Generate Story</button>
        {story.lines.map((line, i) => (
            <div key={i}>
              <img src={story.pictures[i]} alt={`Story Line ${i}`} />
              <p>{line}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
