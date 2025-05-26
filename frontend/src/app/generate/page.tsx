"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useStory } from "@/contexts/StoryContext";

const page = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const { setStory } = useStory();
  const [loading, setLoading] = useState<boolean>(false);

  const generateText = async () => {
    try {
      const response = await axios.post('/api/generate/text', 
        {
          message
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      console.log(response.data);

      return response.data;
    } catch (err) {
      console.error("Error generating text:", err);
    }
  };

  const generateImages = async (paragraphs: string[]) => {
    let images = [];
    try {
      const response = await axios.post("/api/generate/images", {
        paragraphs,
      });

      console.log("HEREREERER", response.data);

      const imageUrls = response.data.imageUrls;

      images = await Promise.all(
        imageUrls.map(async (imageUrl: string) => {
          const response = await axios.get(imageUrl, { responseType: "blob" })
          return URL.createObjectURL(response.data);
        })
      );
    } catch (err) {
      console.error("Error generating images:", err);
    }
    return images;
  };

  const generateStory = async () => {
    setLoading(true);

    const { title, paragraphs } = await generateText();
    console.log(title);
    console.log(paragraphs);
    const images = await generateImages(paragraphs);
    console.log("in here", images)
    

    setStory({
      title, 
      paragraphs, 
      images, 
    });

    setLoading(false);

    router.push("/story");
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col items-center justify-center w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Create Your Own </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Story</span>
        </h1>
        <textarea 
          className="border-2 border-gray-300 rounded-md p-2 mb-8 w-full min-h-12 h-40" 
          placeholder="Enter your story prompt" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        {loading 
          ? <button className="bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl text-lg" disabled>Generating...</button> 
          : <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform transition hover:translate-y-[-2px] text-lg" onClick={() => {generateStory()}}>Generate Story</button>
        }
      </div>
    </div>
  );
}

export default page;
