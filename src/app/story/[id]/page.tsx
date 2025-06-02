import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Storybook from "@/components/Storybook";
import StoryActions from "@/components/StoryActions";
import { getStory } from "@/lib/getStory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { getToken, userId } = await auth();

  const story = await getStory({ bookId: id, userId: userId ?? "", getToken });

  const storyTitle = story.title || "Untitled Story";
  const authorName = story.authorName || "Anonymous";
  const description =
    story.paragraphs?.[0]?.substring(0, 160) || "An AI-generated story";

  return {
    title: `${storyTitle} by ${authorName}`,
    description: `${description}... Read this ${story.genre} story created with AI on StoryBolt.`,
    keywords: [
      story.genre?.toLowerCase(),
      "AI story",
      "generated story",
      storyTitle.toLowerCase(),
      "StoryBolt story",
    ],
    openGraph: {
      title: `${storyTitle} - AI Story by ${authorName}`,
      description: `A ${story.genre} story: ${description}...`,
      url: `https://storybolt.vercel.app/story/${id}`,
      type: "article",
      images: [
        {
          url: story.images?.[0] || "/seo/opengraph-story.png",
          width: 1200,
          height: 630,
          alt: `${storyTitle} - Cover Image`,
        },
      ],
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: `${storyTitle} by ${authorName}`,
      description: `A ${story.genre} story created with AI`,
      images: [story.images?.[0] || "/seo/twitter-image.png"],
    },
    other: {
      "article:author": authorName,
      "article:section": story.genre,
      "article:tag": `${story.genre}, AI Story, Generated Story`,
    },
  };
}

export const revalidate = 60;

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1) Grab Clerk’s session (with cookies) on the server
  const { userId, getToken } = await auth();
  const story = await getStory({ bookId: id, userId: userId ?? "", getToken });

  // 6) Render it, passing query-params down to your client buttons
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Storybook story={story} />
      <StoryActions bookId={id} authorId={story.authorId} />
    </div>
  );
}
