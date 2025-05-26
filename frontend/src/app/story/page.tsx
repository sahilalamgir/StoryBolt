"use client";

import { useMemo, useEffect, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useStory } from "@/contexts/StoryContext";
import { useSession } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';

const page = () => {
  const { story } = useStory();
  // const story = {
  //   title: "Romeo and Juliet Fall in Love, then Die",
  //   paragraphs: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "The cat was very hungry.", "The cat went to the store to buy some food."],
  //   images: ["https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"]
  // }

  // The `useSession()` hook will be used to get the Clerk `session` object
	const { session, isLoaded } = useSession();

  const client = useMemo(() => {
    if (!isLoaded) {
      return null;
    }
    return createClerkSupabaseClient(session);
  }, [isLoaded, session]);

  useEffect(() => {
    console.log('StoryPage mounted or story changed:', story)
  }, [story]);
	
  const saveBook = useCallback(async () => {
    if (!client) return
    await client.from('books').insert({
      title: story.title,
      genre: "Fantasy",
      page_count: story.paragraphs.length,
    })
  }, [client, story]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
        {story.title}
      </h1>
      <Carousel className="w-full max-w-xl mb-8">
        <CarouselContent>
          {story.paragraphs.map((paragraph, i) => (
            <CarouselItem key={i}>
              <Card className="p-0">
                <CardContent className="p-0 flex flex-col">
                  {/* <img 
                    className="rounded-t-lg w-full" 
                    src={`data:image/jpeg;base64,${story.pictures[i]}`} 
                    alt={`Story Line ${i}`} 
                  /> */}
                  <img className="rounded-t-lg w-full" src={story.images[i]}/>
                  <p className="p-4">{paragraph}</p>
                  <p className="p-4 text-center text-gray-500">Page {i + 1} of {story.paragraphs.length}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform transition hover:translate-y-[-2px] text-lg" onClick={saveBook}>
        Save Story
      </button>
    </div>
  )
}

export default page;