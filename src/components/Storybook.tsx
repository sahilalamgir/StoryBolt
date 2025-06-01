import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Story from "@/types/story";
import Image from "next/image";
import DownloadButton from "@/components/buttons/DownloadButton";
import AudioButton from "@/components/buttons/AudioButton";
import { Star } from "lucide-react";

const Storybook = ({ story }: { story: Story }) => {
  return (
    <>
      <div className="flex flex-col gap-y-2 items-center justify-between">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            {story.title}
          </h1>
          <p className="text-2xl text-gray-600 italic mt-2">
            by {story.authorName}
          </p>
        </div>
        <div className="flex flex-row gap-x-5 items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm mt-1 px-4 py-2 rounded-full shadow-sm">
            <span className="text-lg font-semibold bg-black bg-clip-text text-transparent">
              {story.stars}
            </span>
            <Star size={20} className="text-yellow-400" fill="currentColor" />
          </div>
          <DownloadButton story={story} />
        </div>
      </div>
      <Carousel className="w-full max-w-xl mt-6 mb-8">
        <CarouselContent>
          {[story.title, ...story.paragraphs].map((paragraph, i) => (
            <CarouselItem key={i}>
              <Card className="p-0">
                <CardContent className="p-0 flex flex-col">
                  <Image
                    className="rounded-t-lg w-full"
                    src={story.images[i]}
                    alt={`Story Line ${i}`}
                    width={512}
                    height={512}
                  />
                  <p className="p-4">{paragraph}</p>
                  <p className="p-4 text-center text-gray-500">
                    Page {i + 1} of {story.paragraphs.length + 1}
                  </p>
                  <AudioButton text={paragraph} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default Storybook;
