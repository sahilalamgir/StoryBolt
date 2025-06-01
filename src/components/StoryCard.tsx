"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface StoryCardType {
  id: string;
  title: string;
  genre: string;
  cover_image: string;
  user_id: string;
  fullName: string | null;
  stars: number;
}

const StoryCard = ({ story }: { story: StoryCardType }) => {
  return (
    <li>
      <Link href={`/story/${story.id}`} prefetch={true}>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden pt-0">
          <Image
            className="rounded-t-lg w-full"
            src={story.cover_image}
            alt={`Story ${story.id}`}
            priority={false}
            width={512}
            height={512}
          />
          <CardContent className="px-4">
            <div className="min-h-[6rem]">
              <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {story.title}
              </h3>
              <p className="text-md text-gray-600">by {story.fullName}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-600 bg-purple-100 mt-2 px-2 py-1 rounded-full">
                {story.genre}
              </span>
              <div className="flex items-center gap-1">
                <Star
                  size={16}
                  className="text-yellow-400"
                  fill="currentColor"
                />
                <span className="text-sm font-medium text-gray-700">
                  {story.stars}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
};

export default StoryCard;
