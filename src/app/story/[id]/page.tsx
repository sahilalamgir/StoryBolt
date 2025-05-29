import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import Storybook from "@/components/Storybook";
import { useSession } from "@clerk/nextjs";
import StoryActions from "@/components/StoryActions";
import { notFound } from "next/navigation";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>['session']
>;

export const revalidate = 60;

export default async function StoryPage({ params, searchParams }: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ type?: string, stars?: string }>
}) {
  const { id } = await params;
  const { type, stars } = await searchParams;

  // 1) Grab Clerk’s session (with cookies) on the server
  const { getToken } = await auth();

  // 2) Spin up your Clerk-aware Supabase client
  const supabase = createClerkSupabaseClient({
    // mimic the “session” shape expected by createClerkSupabaseClient
    getToken: () => getToken({ template: "supabase" }),
  } as SignedInSessionResource | null | undefined);

  // 3) Fetch the book row; RLS will only let you see it if published=true or user_id=session.userId
  const { data: book, error: bookErr } = await supabase
    .from("books")
    .select("title, genre, cover_image, user_id")
    .eq("id", id)
    .maybeSingle();

  if (bookErr || !book) {
    // Use Next.js not-found mechanism instead of custom UI
    notFound();
  }

  // 4) Fetch pages
  const { data: pages, error: pagesErr } = await supabase
    .from("pages")
    .select("text_content, image_path")
    .eq("book_id", id);

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

  // 6) Render it, passing query-params down to your client buttons
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Storybook story={story} stars={stars ?? "0"} />
      <StoryActions bookId={id} type={type} authorId={book.user_id} />
    </div>
  )
}
