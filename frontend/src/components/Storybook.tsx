import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Story from '@/types/story';

const Storybook = ({ story }: { story: Story }) => {
  return (
    <>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            {story.title}
        </h1>
        <Carousel className="w-full max-w-xl mb-8">
            <CarouselContent>
              {[story.title, ...story.paragraphs].map((paragraph, i) => (
                <CarouselItem key={i}>
                  <Card className="p-0">
                      <CardContent className="p-0 flex flex-col">
                        <img className="rounded-t-lg w-full" src={story.images[i]} alt={`Story Line ${i}`} />
                        <p className="p-4">{paragraph}</p>
                        <p className="p-4 text-center text-gray-500">Page {i + 1} of {story.paragraphs.length + 1}</p>
                      </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </>
  )
}

export default Storybook;
