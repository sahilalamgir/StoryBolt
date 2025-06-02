"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/lib/supabase";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import FavoriteButton from "@/components/buttons/FavoriteButton";
import PublishButton from "@/components/buttons/PublishButton";
import UnfavoriteButton from "@/components/buttons/UnfavoriteButton";
import UnpublishButton from "@/components/buttons/UnpublishButton";
import DeleteButton from "@/components/buttons/DeleteButton";
import { useToast } from "@/components/ui/toast";

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
        addToast("Could not fetch story.", "error");
        return;
      }
      setPublished(data.published);
      setFavorited(data.favorites.length > 0);
    })();
  }, [client, bookId, session?.user.id, addToast]);

  // 1) Favorite handler
  const favoriteStory = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`/api/stories/${bookId}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to favorite story");
      }

      addToast("Story favorited!", "success");
      setFavorited(true);
      router.refresh(); // Refresh server components
    } catch (err) {
      void err;
      addToast("Could not favorite story.", "error");
    }
  }, [bookId, addToast, router]);

  // 2) Publish handler
  const publishStory = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`/api/stories/${bookId}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to publish story");
      }

      addToast("Story published!", "success");
      setPublished(true);
      router.refresh(); // Refresh server components
    } catch (err) {
      void err;
      addToast("Could not publish story.", "error");
    }
  }, [bookId, addToast, router]);

  // 3) Unfavorite handler
  const unfavoriteStory = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`/api/stories/${bookId}/favorite`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to unfavorite story");
      }

      addToast("Story unfavorited!", "success");
      setFavorited(false);
      router.refresh(); // Refresh server components
      router.push(`/favorited`);
    } catch (err) {
      void err;
      addToast("Could not unfavorite story.", "error");
    }
  }, [bookId, router, addToast]);

  // 4) Unpublish handler
  const unpublishStory = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`/api/stories/${bookId}/publish`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to unpublish story");
      }

      addToast("Story unpublished!", "success");
      setPublished(false);
      router.refresh(); // Refresh server components
      router.push(`/community`);
    } catch (err) {
      void err;
      addToast("Could not unpublish story.", "error");
    }
  }, [bookId, router, addToast]);

  // 5) Delete handler
  const deleteStory = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`/api/stories/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      addToast("Story deleted!", "success");
      router.refresh(); // Refresh server components
      router.push(`/history`);
    } catch (err) {
      void err;
      addToast("Could not delete story.", "error");
    }
  }, [bookId, router, addToast]);

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
