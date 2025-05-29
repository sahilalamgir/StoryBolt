// app/story/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import Storybook from "@/components/Storybook";
import { useSession } from "@clerk/nextjs";
import StoryActions from "@/components/StoryActions";
type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>['session']
>;

export default async function StoryPage({ params, searchParams }: {
  params: Promise<{ id: string }>,
  searchParams: { type?: string, stars?: string }
}) {
  const { id } = await params;

  // 1) Grab Clerk’s session (with cookies) on the server
  const { getToken } = await auth();
  // 2) Spin up your Clerk-aware Supabase client
  const client = createClerkSupabaseClient({
    // mimic the “session” shape expected by createClerkSupabaseClient
    getToken: () => getToken({ template: "supabase" }),
  } as SignedInSessionResource | null | undefined);

  // 3) Fetch the book row; RLS will only let you see it if published=true or user_id=session.userId
  const { data: book, error: bookErr } = await client
    .from("books")
    .select("title, genre, cover_image, user_id")
    .eq("id", id)
    .maybeSingle();

  if (bookErr || !book) {
    // return 404 UI
    return <p>Story not found.</p>;
  }

  // 4) Fetch pages
  const { data: pages, error: pagesErr } = await client
    .from("pages")
    .select("text_content, image_path")
    .eq("book_id", id);

  if (pagesErr || !pages) {
    return <p>Couldn&apos;t load pages.</p>;
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
      <Storybook story={story} stars={searchParams.stars ?? "0"} />
      <StoryActions bookId={id} type={searchParams.type} authorId={book.user_id} />
    </div>
  )
}
