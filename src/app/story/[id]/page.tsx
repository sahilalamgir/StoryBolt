import { auth } from "@clerk/nextjs/server";
import Storybook from "@/components/Storybook";
import StoryActions from "@/components/StoryActions";
import { getStory } from "@/lib/getStory";

export const revalidate = 60;

export default async function StoryPage({ params, searchParams }: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = await params;
  const { type } = await searchParams;

  // 1) Grab Clerk’s session (with cookies) on the server
  const { userId, getToken } = await auth();
  const story = await getStory({ bookId: id, userId: userId ?? "", getToken });

  // 6) Render it, passing query-params down to your client buttons
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Storybook story={story} />
      <StoryActions bookId={id} type={type} authorId={story.authorId} />
    </div>
  )
}
