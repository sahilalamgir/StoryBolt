import { useSession } from '@clerk/nextjs';
import createClerkSupabaseClient from './supabase';
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>['session']
>;

export type StoryParams = {
    bookId: string;
    getToken: () => Promise<string | null>;
};

export const getStory = unstable_cache(
    async ({ bookId, getToken }: StoryParams) => {
        // 2) Spin up your Clerk-aware Supabase client
        const supabase = createClerkSupabaseClient({
            // mimic the “session” shape expected by createClerkSupabaseClient
            getToken,
        } as SignedInSessionResource | null | undefined);

        // 3) Fetch the book row; RLS will only let you see it if published=true or user_id=session.userId
        const { data: book, error: bookErr } = await supabase
            .from("books")
            .select("title, genre, cover_image, user_id")
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

        // 5) Build the story shape
        const story = {
            title: book.title,
            genre: book.genre,
            images: [book.cover_image, ...pages.map(p => p.image_path)],
            paragraphs: pages.map(p => p.text_content),
        };
        
        return story;
    },
    ['story'],
    { revalidate: 60 }
);
