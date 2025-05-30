'use client';

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/lib/supabase";
import React, { useMemo, useCallback } from "react";
import FavoriteButton from "./FavoriteButton";
import PublishButton from "./PublishButton";
import UnfavoriteButton from "./UnfavoriteButton";
import UnpublishButton from "./UnpublishButton";
import DeleteButton from "./DeleteButton";

interface Props {
  bookId:   string;
  type?:    string;
  authorId: string;
}

export default function StoryActions({ bookId, type, authorId }: Props) {
  const { session, isLoaded } = useSession();
  const router = useRouter();

  const client = useMemo(() => {
    if (!isLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [session, isLoaded]);

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
        router.push(`/${type}`);
    }, [client, bookId, type, router]);

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
    router.push(`/${type}`);
    }, [client, bookId, type, router]);

    // 5) Delete handler
    const deleteStory = useCallback(async () => {
        if (!client) return;
        const { error: bookError } = await client
          .from('books')
          .delete()
          .eq('id', bookId);
        if (bookError) {
          console.error("Delete error:", bookError);
          alert("Could not delete story.");
          return;
        }
        const { error: favoriteError } = await client
          .from('favorites')
          .delete()
          .eq('book_id', bookId);
        if (favoriteError) {
          console.error("Delete error:", favoriteError);
          alert("Could not delete story.");
          return;
        }
        const { error: pageError } = await client
          .from('pages')
          .delete()
          .eq('book_id', bookId);
        if (pageError) {
          console.error("Delete error:", pageError);
          alert("Could not delete story.");
          return;
        }
        alert("Story deleted!");
        router.push(`/${type}`);
    }, [client, bookId, type, router]);

  return (
    <>
    {(type === "history") &&
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <FavoriteButton favoriteFunction={favoriteStory} />
              <PublishButton publishFunction={publishStory} />
              <DeleteButton deleteFunction={deleteStory} />
            </div>
      }
      {(type === "favorited") &&
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <UnfavoriteButton unfavoriteFunction={unfavoriteStory} />
              {authorId === session?.user.id &&
                  <DeleteButton deleteFunction={deleteStory} />
              }
          </div>
      }
      {(type === "community") &&
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <FavoriteButton favoriteFunction={favoriteStory} />
              {authorId === session?.user.id &&
              <>
                  <UnpublishButton unpublishFunction={unpublishStory} />
                  <DeleteButton deleteFunction={deleteStory} />
              </>
              }
          </div>
          
      }
    </>
  );
}
