"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useStory } from "@/contexts/StoryContext";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const { setStory } = useStory();
  const [loading, setLoading] = useState<boolean>(false);

  const generateLines = async () => {
    try {
      const response = await axios.post("http://0.0.0.0:8000/generate-text", {
          prompt: message,
      });

      console.log(response.data.generated_text);

      return response.data.generated_text.split("\n\n");
    } catch (err) {
      console.error("Error generating story lines:", err);
    }
  };

  const generatePictures = async (lines: string[]) => {
    let images = []
    try {
      const response = await axios.post("http://0.0.0.0:8000/generate-image", {
        text: lines,
      });

      images = response.data.images;

      console.log("picture below b64:");
      console.log(images);
      console.log("picture above b64:");
    } catch (err) {
      console.error("Error generating story pictures:", err);
    }

    return images;
  };

  const generateStory = async () => {
    setLoading(true);

    const lines = await generateLines();
    const pictures = await generatePictures(lines);

    setStory({lines, pictures});

    setLoading(false);

    router.push("/story");
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
        {loading 
          ? <button className="bg-gray-500 text-gray-300 p-2 m-2 rounded-md" disabled onClick={() => {generateStory()}}>Generating...</button> 
          : <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-2 m-2 rounded-md" onClick={() => {generateStory()}}>Generate Story</button>
        }
      </div>
    </div>
  );
}
