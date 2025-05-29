"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Storybook from '@/components/Storybook';
import { useSession, useUser } from '@clerk/nextjs';
import createClerkSupabaseClient from '@/lib/supabase';
import { defaultStory } from '@/contexts/StoryContext';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import UnfavoriteButton from '@/components/UnfavoriteButton';
import PublishButton from '@/components/PublishButton';
import Story from '@/types/story';
import UnpublishButton from '@/components/UnpublishButton';

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const stars = searchParams.get('stars');

  const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const [story, setStory] = useState<Story>(defaultStory);
  const [authorId, setAuthorId] = useState("");
  const [loading, setLoading] = useState(true);

  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  useEffect(() => {
    if (!client || !userLoaded) return;
    const fetchStory = async () => {
        setLoading(true);
        try {
            const { data: bookData, error: bookError } = await client
                .from("books")
                .select("title, genre, cover_image, user_id")
                .eq("id", id)
                .single();
            if (bookError) {
                console.error(bookError);
                return null;
            }
            console.log(bookData);
            setAuthorId(bookData.user_id);
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
  }, [client, id, userLoaded]);

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

    // 4) Unpublish handler
  const unpublishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
      .from('books')
      .update({ 
        published: false,
        published_at: null,
      })
      .eq('id', id);
    if (error) {
      console.error("Unpublish error:", error);
      alert("Could not unpublish story.");
    } else {
      alert("Story unpublished!");
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <UnfavoriteButton unfavoriteFunction={unfavoriteStory} />
                    </div>
                }
                {(type === "community") &&
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <FavoriteButton favoriteFunction={favoriteStory} />
                        {authorId === user?.id &&
                            <UnpublishButton unpublishFunction={unpublishStory} />
                        }
                    </div>
                    
                }
            </>
        }
    </div>
  )
}

export default Page