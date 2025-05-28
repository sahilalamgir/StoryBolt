"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Storybook from '@/components/Storybook';
import { useSession } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import { defaultStory } from '@/contexts/StoryContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import UnfavoriteButton from '@/components/UnfavoriteButton';
import PublishButton from '@/components/PublishButton';

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();

    const { id } = params;
    const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const stars = searchParams.get('stars');
  console.log("type is", type);

    const { session, isLoaded: sessionLoaded } = useSession();
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

    // 1) Favorite handler
    const favoriteStory = useCallback(async () => {
      if (!client || !id) return;
      const { error } = await client
        .from('favorites')
        .insert({
          book_id: id,
        });
      if (error) {
        console.error("Favorite error:", error);
        alert("Could not favorite story.");
      } else {
        alert("Story favorited!");
      }
    }, [client, id]);

  // 2) Publish handler
  const publishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
      .from('books')
      .update({ 
        published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) {
      console.error("Publish error:", error);
      alert("Could not publish story.");
    } else {
      alert("Story published!");
    }
  }, [client, id]);

    // 3) Unfavorite handler
    const unfavoriteStory = useCallback(async () => {
        if (!client) return;
        const { error } = await client
        .from('favorites')
        .delete()
        .eq('book_id', id);
        if (error) {
            console.error("Unfavorite error:", error);
            alert("Could not unfavorite story.");
        } else {
            alert("Story unfavorited!");
        }
        router.push(`/${type}`);
    }, [client, id, type, router]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {loading 
            ? <p>Loading...</p>
            : <>
                <Storybook story={story} stars={stars || "0"} />
                {(type === "history") &&
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <FavoriteButton favoriteFunction={favoriteStory} />
                        <PublishButton publishFunction={publishStory} />
                      </div>
                }
                {(type === "favorited") &&
                    <UnfavoriteButton unfavoriteFunction={unfavoriteStory} />
                }
                {(type === "community") &&
                    <FavoriteButton favoriteFunction={favoriteStory} />
                }
            </>
        }
    </div>
  )
}

export default Page