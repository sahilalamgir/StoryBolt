"use client";

import { useMemo, useEffect } from 'react'
import { useStory } from "@/contexts/StoryContext";
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import Story from '@/components/Storybook';

const page = () => {
  // The `useSession()` hook will be used to get the Clerk `session` object
	const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const { story } = useStory();

  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  useEffect(() => {
    console.log('StoryPage mounted or story changed:', story)
  }, [story]);

  const savePages = async (bookId: string) => {
    if (!client) return;

    // bulk‑insert pages
    const pagesInserts = story.paragraphs.map((para, i) => ({
      book_id:      bookId,
      page_number:  i + 1,
      text_content: para,
      image_path:   story.images[i + 1],
    }));
    const { error: pagesErr } = await client
      .from("pages")
      .insert(pagesInserts);
    if (pagesErr) console.error("Could not insert pages:", pagesErr);
  }
  
  const saveStory = async () => {
    if (!client || !user) return;

    // check for existing by user+title
    const { data: existing, error: _err } = await client
      .from("books")
      .select("id, saved, published")
      .eq("user_id", user.id)
      .eq("title", story.title)
      .maybeSingle();
    
    if (!existing) {
      // first time ever: insert book with saved=true
      const { data: bookRow, error: insertErr } = await client
        .from("books")
        .insert({
          title:       story.title,
          genre:       story.genre,
          page_count:  story.paragraphs.length,
          cover_image: story.images[0],
          saved:       true,
          published:   false,
        })
        .select("id")
        .single();

      if (insertErr || !bookRow) {
        console.error("Could not save book:", insertErr);
        return;
      }

      await savePages(bookRow.id);

      alert("Book saved!");
      return;
    }

    // already existed
    if (existing.saved) {
      alert("You've already saved this book.");
      return;
    }

    // flip saved flag to true
    const { error: updErr } = await client
      .from("books")
      .update({ saved: true })
      .eq("id", existing.id);
    if (updErr) console.error(updErr);
    else alert("Book saved!");
  }

  const publishStory = async () => {
    if (!client || !user) return;

    // check for existing
    const { data: existing, error: _err } = await client
      .from("books")
      .select("id, saved, published")
      .eq("user_id", user.id)
      .eq("title", story.title)
      .maybeSingle();
    
      if (!existing) {
        // first time: insert with published=true
        const { data: bookRow, error: insertErr } = await client
          .from("books")
          .insert({
            title:       story.title,
            genre:       story.genre,
            page_count:  story.paragraphs.length,
            cover_image: story.images[0],
            saved:       false,
            published:   true,
          })
          .select("id")
          .single();
        
        if (insertErr || !bookRow) {
          console.error("Could not publish book:", insertErr);
          return;
        }

        await savePages(bookRow.id);

        alert("Book published!");
        return;
      }

      if (existing.published) {
        alert("This book is already published.");
        return;
      }
  
      // flip published flag
      const { error: updErr } = await client
        .from("books")
        .update({ published: true })
        .eq("id", existing.id);
      if (updErr) console.error(updErr);
      else alert("Book published!");
  }

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