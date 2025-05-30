"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStory } from "@/contexts/StoryContext";
import { useSession, useUser } from '@clerk/nextjs';
import createClerkSupabaseClient from '@/lib/supabase';
import Storybook from '@/components/Storybook';
import StoryActions from '@/components/StoryActions';
import { useRouter } from 'next/navigation';

export default function StoryPage() {
  const router = useRouter();
  const { story } = useStory();
  const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const [bookId, setBookId] = useState<string | null>(null);
  const hasInserted = useRef(false);
  
  // build Supabase client once
  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  // On first mount (or when story changes) insert the book+pages exactly once
  useEffect(() => {
    if (!client || !userLoaded || hasInserted.current) return;
    if (!story.title) {
      router.replace("/generate");
    };

    hasInserted.current = true;  // prevent re‑runs
    (async () => {
      // attempt to find an existing book row
      const { data: existing, error: selErr } = await client
        .from('books')
        .select('id')
        .eq('user_id', user!.id)
        .eq('title', story.title)
        .maybeSingle();

      if (selErr) {
        console.error("Error checking existing book:", selErr);
        return;
      }

      if (existing?.id) {
        setBookId(existing.id);
        return;
      }

      // insert new book
      const { data: newBook, error: insErr } = await client
        .from('books')
        .insert({
          user_id:     user!.id,
          title:       story.title,
          genre:       story.genre,
          page_count:  story.paragraphs.length,
          cover_image: story.images[0],
          published:   false,
        })
        .select('id')
        .single();

      if (insErr || !newBook?.id) {
        console.error("Error inserting book:", insErr);
        return;
      }
      setBookId(newBook.id);

      // bulk insert pages
      const pages = story.paragraphs.map((para, idx) => ({
        book_id:      newBook.id,
        page_number:  idx + 1,
        text_content: para,
        image_path:   story.images[idx + 1],
      }));
      const { error: pagesErr } = await client.from('pages').insert(pages);
      if (pagesErr) console.error("Error inserting pages:", pagesErr);
    })();
  }, [client, user, userLoaded, story, router]);

  // until context is populated, you might want to render nothing
  if (!story.title) return null;

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20
                    bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Storybook story={story} />
      <StoryActions type="history" bookId={bookId ?? ""} authorId={story.authorId} />
    </div>
  );
}
