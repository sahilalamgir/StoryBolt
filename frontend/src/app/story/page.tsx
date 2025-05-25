"use client";

import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Story from "@/types/story";

const page = (story: Story) => {
  return (
    <>
        <Carousel>
            <CarouselContent>
                {story.lines.map((line, i) => (
                    <CarouselItem className="basis-1/3">
                        <div key={i}>
                            <img src={`data:image/jpeg;base64,${story.pictures[i]}`} alt={`Story Line ${i}`} />
                            <p>{line}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    </>
  )
}

export default page;