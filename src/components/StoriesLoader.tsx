import { auth } from "@clerk/nextjs/server";
import { getStories } from "@/lib/getStories";
import StoryBox from "@/components/StoryBox";

interface StoriesLoaderProps {
  type: "community" | "history" | "favorited";
  query?: string;
  genre?: string;
}

export default async function StoriesLoader({
  type,
  query,
  genre,
}: StoriesLoaderProps) {
  const { getToken, userId } = await auth();

  const stories = await getStories({
    type,
    query,
    genre,
    userId: userId ?? undefined,
    getToken: () => getToken({ template: "supabase" }),
  });

  return <StoryBox stories={stories} />;
}
