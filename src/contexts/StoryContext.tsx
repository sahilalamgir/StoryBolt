"use client";

import React, { createContext, useContext, useState } from "react";
import Story from "@/types/story";

interface StoryContextProps {
  story: Story;
  setStory: (story: Story) => void;
}

export const defaultStory: Story = {
  title: "",
  paragraphs: [],
  images: [],
  genre: "",
  stars: 0,
  authorId: "",
  authorName: "",
};

const StoryContext = createContext<StoryContextProps>({
  story: defaultStory,
  setStory: () => {},
});

export const StoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [story, setStory] = useState<Story>(defaultStory);
  return (
    <StoryContext.Provider value={{ story, setStory }}>
      {children}
    </StoryContext.Provider>
  );
};

export function useStory() {
  return useContext(StoryContext);
}
