"use client";

import React, { useState, useEffect, useMemo, use } from 'react'
import Storybook from '@/components/Storybook';
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import Story from '@/types/story';
import { defaultStory } from '@/contexts/StoryContext';

const page = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const [story, setStory] = useState<{ title: string, genre: string, images: string[], paragraphs: string[] }>(defaultStory);
  const [loading, setLoading] = useState(true);

  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  useEffect(() => {
    if (!client) return;
    const fetchStory = async () => {
        setLoading(true);
        try {
            const { data: bookData, error: bookError } = await client
                .from("books")
                .select("title, genre, cover_image")
                .eq("id", id)
                .single();
            if (bookError) {
                console.error(bookError);
                return null;
            }
            console.log(bookData);
            const { data: pagesData, error: pagesError } = await client
                .from("pages")
                .select("text_content, image_path")
                .eq("book_id", id);
            if (pagesError) {
                console.error(pagesError);
                return null;
            }
            console.log(pagesData);
            setStory({
                title: bookData.title,
                genre: bookData.genre,
                images: [bookData.cover_image, ...(pagesData.map((pageData) => 
                    pageData.image_path
                ))],
                paragraphs: pagesData.map((pageData) => 
                    pageData.text_content
                ),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchStory();
  }, [client, id]);
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {loading 
            ? <p>Loading...</p>
            : <Storybook story={ story } />
        }
    </div>
  )
}

export default page