'use client';

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/lib/supabase";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import FavoriteButton from "./FavoriteButton";
import PublishButton from "./PublishButton";
import UnfavoriteButton from "./UnfavoriteButton";
import UnpublishButton from "./UnpublishButton";
import DeleteButton from "./DeleteButton";

interface Props {
  bookId:   string;
  authorId: string;
}

export default function StoryActions({ bookId, authorId }: Props) {
  const { session, isLoaded } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [published, setPublished] = useState(false);

  const client = useMemo(() => {
    if (!isLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [session, isLoaded]);

  useEffect(() => {
    if (!client || !bookId) return;
    const fetchStory = async () => {
      const { data: bookData, error: bookError } = await client
        .from('books')
        .select('favorited, published')
        .eq('id', bookId)
        .single();
      if (bookError || !bookData) {
        console.error("Fetch error:", bookError);
        return;
      }
      const { data: favoriteData, error: favoriteError } = await client
        .from('favorites')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', session?.user.id)
        .maybeSingle();
      if (favoriteError) {
        console.error("Fetch error:", favoriteError);
        return;
      }
      setFavorited(!!favoriteData);
      setPublished(bookData.published);
    };
    fetchStory();
  }, [client, bookId, session?.user.id]);

  // 1) Favorite handler
  const favoriteStory = useCallback(async () => {
    if (!client || !bookId) return;
    const { error } = await client
      .from('favorites')
      .insert({
        book_id: bookId,
      });
    if (error) {
      console.error("Favorite error:", error);
      alert("Could not favorite story.");
      return;
    } else {
      alert("Story favorited!");
    }
  }, [client, bookId]);

    // 2) Publish handler
    const publishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
        .from('books')
        .update({ 
        published: true,
        published_at: new Date().toISOString(),
        })
        .eq('id', bookId);
    if (error) {
        console.error("Publish error:", error);
        alert("Could not publish story.");
        return;
    } else {
        alert("Story published!");
    }
    }, [client, bookId]);

    // 3) Unfavorite handler
    const unfavoriteStory = useCallback(async () => {
        if (!client) return;
        const { error } = await client
        .from('favorites')
        .delete()
        .eq('book_id', bookId);
        if (error) {
            console.error("Unfavorite error:", error);
            alert("Could not unfavorite story.");
            return;
        } else {
            alert("Story unfavorited!");
        }
        router.push(`/favorited`);
    }, [client, bookId, router]);

    // 4) Unpublish handler
    const unpublishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
    .from('books')
    .update({ 
        published: false,
        published_at: null,
    })
    .eq('id', bookId);
    if (error) {
      console.error("Unpublish error:", error);
      alert("Could not unpublish story.");
      return;
    } else {
      alert("Story unpublished!");
    }
    router.push(`/community`);
    }, [client, bookId, router]);

    // 5) Delete handler
    const deleteStory = useCallback(async () => {
        if (!client) return;
        const { error } = await client
          .from('books')
          .delete()
          .eq('id', bookId);
        if (error) {
          console.error("Delete error:", error);
          alert("Could not delete story.");
          return;
        }
        alert("Story deleted!");
        router.push(`/history`);
    }, [client, bookId, router]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      {favorited ?
        <UnfavoriteButton unfavoriteFunction={unfavoriteStory} />
        :
        <FavoriteButton favoriteFunction={favoriteStory} />
      }
      {authorId === session?.user.id &&
        <>
          {published ?
            <UnpublishButton unpublishFunction={unpublishStory} />
            :
            <PublishButton publishFunction={publishStory} />
          }
          <DeleteButton deleteFunction={deleteStory} />
        </>
      }
    </div>
  );
}
