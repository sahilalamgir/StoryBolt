import React from "react";
import StoryForm from "@/components/StoryForm";

const page = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col items-center justify-center w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Create Your Own </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Story</span>
        </h1>
        <StoryForm />
      </div>
    </div>
  );
}

export default page;
