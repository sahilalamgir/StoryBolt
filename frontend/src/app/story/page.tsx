"use client";

import { useMemo, useEffect, useCallback } from 'react'
import { useStory } from "@/contexts/StoryContext";
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import Story from '@/components/Storybook';

const page = () => {
  const { story } = useStory();
  // const story = {
  //   title: "ffad",
  //   paragraphs: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "The cat was very hungry.", "The cat went to the store to buy some food."],
  //   images: ["https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"],
  //   genre: "Sci-Fi"
  // }

  // The `useSession()` hook will be used to get the Clerk `session` object
	const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();

  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  useEffect(() => {
    console.log('StoryPage mounted or story changed:', story)
  }, [story]);
  
  const saveStory = useCallback(async () => {
    if (!client) return;
    const { data: bookData, error: bookError } = await client
      .from('books')
      .insert({
        title: story.title,
        genre: story.genre,
        page_count: story.paragraphs.length,
        cover_image: story.images[0],
      })
      .select("id")
      .single();
    console.log("data", bookData);
    if (bookError) {
      alert("This book (or a book with the same title) has already been saved before.");
      return null;
    }
    for (let i = 0; i < story.paragraphs.length; i++) {
      const { error: pageError } = await client
        .from('pages')
        .insert({
          book_id: bookData.id,
          page_number: i + 1,
          text_content: story.paragraphs[i],
          image_path: story.images[i + 1],
        });
      if (pageError) {
        console.error(pageError);
      }
    }
    return bookData.id;
  }, [client, story]);

  const publishStory = useCallback(async () => {
    if (!client || !user) {
      console.log("safsad"); 
      return;
    }
    console.log("fsa");
    const { error } = await client
      .from('books')
      .update({ published: true })
      .eq('user_id', user.id)
      .eq('title', story.title);
    console.error(error);
    if (error) alert("This book has already been published before.");
  }, [client, user, story]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Story story={story} />
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition" onClick={saveStory}>
          Save Story
        </button>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition hover:translate-y-[-2px]" onClick={publishStory}>
          Publish Story
        </button>
      </div>
    </div>
  )
}

export default page;