import { useSession } from "@clerk/nextjs";
import createClerkSupabaseClient from "./supabase";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getAuthorName } from "./getAuthorNames";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

export type StoryParams = {
  bookId: string;
  userId: string;
  getToken: () => Promise<string | null>;
};

export const getStory = unstable_cache(
  async ({ bookId, userId, getToken }: StoryParams) => {
    void userId;

    // 2) Spin up your Clerk-aware Supabase client
    const supabase = createClerkSupabaseClient({
      // mimic the “session” shape expected by createClerkSupabaseClient
      getToken,
    } as SignedInSessionResource | null | undefined);

    // 3) Fetch the book row; RLS will only let you see it if published=true or user_id=session.userId
    const { data: book, error: bookErr } = await supabase
      .from("books")
      .select("title, genre, cover_image, user_id, favorites!book_id (count)")
      .eq("id", bookId)
      .maybeSingle();

    if (bookErr || !book) {
      // Use Next.js not-found mechanism instead of custom UI
      notFound();
    }

    // 4) Fetch pages
    const { data: pages, error: pagesErr } = await supabase
      .from("pages")
      .select("text_content, image_path")
      .eq("book_id", bookId);

    if (pagesErr || !pages) {
      // Use Next.js not-found mechanism for missing pages too
      notFound();
    }

    const authorName = await getAuthorName(book.user_id);

    // 5) Build the story shape
    const story = {
      title: book.title,
      genre: book.genre,
      images: [book.cover_image, ...pages.map((p) => p.image_path)],
      paragraphs: pages.map((p) => p.text_content),
      stars: book.favorites?.[0]?.count ?? 0,
      authorId: book.user_id,
      authorName: authorName ?? "",
    };

    return story;
  },
  ["getStory"],
  { revalidate: 60 },
);
