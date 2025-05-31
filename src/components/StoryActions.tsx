"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/lib/supabase";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import FavoriteButton from "./FavoriteButton";
import PublishButton from "./PublishButton";
import UnfavoriteButton from "./UnfavoriteButton";
import UnpublishButton from "./UnpublishButton";
import DeleteButton from "./DeleteButton";
import { useToast } from "./ui/toast";

interface Props {
  bookId: string;
  authorId: string;
}

export default function StoryActions({ bookId, authorId }: Props) {
  const { session, isLoaded } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [published, setPublished] = useState(false);
  const { addToast } = useToast();

  const client = useMemo(() => {
    if (!isLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [session, isLoaded]);

  useEffect(() => {
    if (!client || !bookId) return;
    (async () => {
      const { data, error } = await client
        .from("books")
        .select(`published, favorites(id)`)
        .eq("id", bookId)
        .eq("favorites.user_id", session?.user.id)
        .single();
      if (error) {
        console.error("Fetch error:", error);
        return;
      }
      setPublished(data.published);
      setFavorited(data.favorites.length > 0);
    })();
  }, [client, bookId, session?.user.id]);

  // 1) Favorite handler
  const favoriteStory = useCallback(async () => {
    if (!client || !bookId) return;
    const { error } = await client.from("favorites").insert({
      book_id: bookId,
    });
    if (error) {
      console.error("Favorite error:", error);
      addToast("Could not favorite story.", "error");
      return;
    } else {
      addToast("Story favorited!", "success");
      setFavorited(true);
    }
  }, [client, bookId, addToast]);

  // 2) Publish handler
  const publishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
      .from("books")
      .update({
        published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", bookId);
    if (error) {
      console.error("Publish error:", error);
      addToast("Could not publish story.", "error");
      return;
    } else {
      addToast("Story published!", "success");
      setPublished(true);
    }
  }, [client, bookId, addToast]);

  // 3) Unfavorite handler
  const unfavoriteStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
      .from("favorites")
      .delete()
      .eq("book_id", bookId);
    if (error) {
      console.error("Unfavorite error:", error);
      addToast("Could not unfavorite story.", "error");
      return;
    } else {
      addToast("Story unfavorited!", "success");
      setFavorited(false);
    }
    router.push(`/favorited`);
  }, [client, bookId, router, addToast]);

  // 4) Unpublish handler
  const unpublishStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client
      .from("books")
      .update({
        published: false,
        published_at: null,
      })
      .eq("id", bookId);
    if (error) {
      console.error("Unpublish error:", error);
      addToast("Could not unpublish story.", "error");
      return;
    } else {
      addToast("Story unpublished!", "success");
      setPublished(false);
    }
    router.push(`/community`);
  }, [client, bookId, router, addToast]);

  // 5) Delete handler
  const deleteStory = useCallback(async () => {
    if (!client) return;
    const { error } = await client.from("books").delete().eq("id", bookId);
    if (error) {
      console.error("Delete error:", error);
      addToast("Could not delete story.", "error");
      return;
    }
    addToast("Story deleted!", "success");
    router.push(`/history`);
  }, [client, bookId, router, addToast]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      {favorited ? (
        <UnfavoriteButton unfavoriteFunction={unfavoriteStory} />
      ) : (
        <FavoriteButton favoriteFunction={favoriteStory} />
      )}
      {authorId === session?.user.id && (
        <>
          {published ? (
            <UnpublishButton unpublishFunction={unpublishStory} />
          ) : (
            <PublishButton publishFunction={publishStory} />
          )}
          <DeleteButton deleteFunction={deleteStory} />
        </>
      )}
    </div>
  );
}
