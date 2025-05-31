import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "./supabase";
import { unstable_cache } from "next/cache";
import { getAuthorNames } from "./getAuthorNames";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

interface StoryRow {
  id: string;
  title: string;
  genre: string;
  cover_image: string;
  user_id: string;
  stars: number;
}

export type StoryParams = {
  type: "community" | "history" | "favorited";
  query?: string;
  genre?: string;
  userId?: string;
  getToken: () => Promise<string | null>;
};

export const getStories = unstable_cache(
  async ({ type, query, genre, userId, getToken }: StoryParams) => {
    // 2) Spin up your Clerk-aware Supabase client
    const supabase = createClerkSupabaseClient({
      getToken,
    } as SignedInSessionResource | null | undefined);

    let stories: StoryRow[] = [];
    try {
      let builder;
      if (type === "favorited") {
        const { data: favoriteData, error: favoriteError } = await supabase
          .from("favorites")
          .select("book_id, favorited_at")
          .eq("user_id", userId)
          .order("favorited_at", { ascending: false });
        if (favoriteError) {
          console.error(favoriteError);
        }
        builder = supabase
          .from("books")
          .select(
            "id, title, genre, cover_image, user_id, favorites!book_id (count)",
          )
          .in("id", favoriteData?.map((f) => f.book_id) || []);
      } else {
        builder = supabase
          .from("books")
          .select(
            "id, title, genre, cover_image, user_id, favorites!book_id (count)",
          );
        if (type === "community") {
          builder = builder
            .eq("published", true)
            .order("published_at", { ascending: false });
        } else {
          builder = builder
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        }
      }

      if (query) {
        builder = builder.ilike("title", `%${query}%`);
      }
      if (genre && genre !== "All") {
        builder = builder.eq("genre", genre);
      }

      const { data, error } = await builder;
      if (error) {
        console.error(error);
      } else {
        // Transform the data to include the favorite count
        const transformedData = data.map((book) => ({
          ...book,
          stars: book.favorites?.[0]?.count || 0,
        }));
        stories = transformedData;
      }
    } catch (err) {
      console.error(err);
    }

    const userIds = [...new Set(stories.map((s) => s.user_id))]; // Remove duplicates
    const authorNames = await getAuthorNames(userIds);

    return stories.map((s) => ({
      ...s,
      fullName: authorNames[s.user_id] || null,
    }));
  },
  ["getStories"],
  { revalidate: 60 },
);
