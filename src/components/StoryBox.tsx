import React from "react";
import StoryCard from "./StoryCard";

interface StoryBoxType {
  fullName: string | null;
  id: string;
  title: string;
  genre: string;
  cover_image: string;
  user_id: string;
  stars: number;
}

const StoryBox = ({ stories }: { stories: StoryBoxType[] }) => {
  return (
    <>
      {stories.length === 0 ? (
        <p className="text-2xl text-center">No stories found</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[80%]">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ul>
      )}
    </>
  );
};

export default StoryBox;
