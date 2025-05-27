"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useStory } from "@/contexts/StoryContext";
import { useSession, useUser } from '@clerk/nextjs';
import createClerkSupabaseClient from '@/lib/supabase';
import Story from '@/components/Storybook';

export default function StoryPage() {
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

  // 1) On first mount (or when story changes) insert the book+pages exactly once
  useEffect(() => {
    if (!client || !userLoaded || hasInserted.current) return;
    if (!story.title) return; // nothing to insert yet

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
          saved:       false,
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
  }, [client, userLoaded, story]);

  // 2) “Save” (favorite) handler
  const saveStory = useCallback(async () => {
    if (!client || !bookId) return;
    const { data, error } = await client
      .from('books')
      .update({ saved: true })
      .eq('id', bookId);
    if (error) {
      console.error("Save error:", error);
      alert("Could not save story.");
    } else {
      alert("Story saved!");
    }
  }, [client, bookId]);

  // 3) Publish handler
  const publishStory = useCallback(async () => {
    if (!client || !bookId) return;
    const { data, error } = await client
      .from('books')
      .update({ published: true })
      .eq('id', bookId);
    if (error) {
      console.error("Publish error:", error);
      alert("Could not publish story.");
    } else {
      alert("Story published!");
    }
  }, [client, bookId]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20
                    bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Story story={story} />

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={saveStory}
          className="bg-white border-2 border-indigo-600 text-indigo-600
                     font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition"
        >
          Save Story
        </button>

        <button
          onClick={publishStory}
          className="bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white font-bold py-3 px-8 rounded-xl shadow-lg
                     hover:shadow-xl transform transition hover:-translate-y-1"
        >
          Publish Story
        </button>
      </div>
    </div>
  );
}
