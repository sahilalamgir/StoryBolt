"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useStory } from "@/contexts/StoryContext";

const page = () => {
    const { story } = useStory();
    // const story = {
    //   lines: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "The cat was very hungry.", "The cat went to the store to buy some food."],
    //   pictures: ["https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"]
    // }
    console.log(story);
    return (
      <div className="flex flex-col items-center min-h-screen py-10">
        <Carousel className="w-full max-w-xl">
          <CarouselContent>
          {story.lines.map((line, i) => (
            <CarouselItem key={i}>
                <Card className="p-0">
                  <CardContent className="p-0 flex flex-col">
                    <img 
                      className="rounded-t-lg w-full" 
                      src={`data:image/jpeg;base64,${story.pictures[i]}`} 
                      alt={`Story Line ${i}`} 
                    />
                    <p className="p-4">{line}</p>
                  </CardContent>
                </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>
    )
}

export default page;