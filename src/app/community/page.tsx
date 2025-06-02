import { Metadata } from "next";
import StorySearch from "@/components/StorySearch";
import StoriesLoader from "@/components/StoriesLoader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Community Stories - Discover AI-Generated Stories",
  description:
    "Explore amazing AI-generated stories from the StoryBolt community. Discover fantasy, sci-fi, romance, and mystery stories created by users worldwide.",
  keywords: [
    "community stories",
    "AI story collection",
    "published stories",
    "story library",
    "shared stories",
  ],
  openGraph: {
    title: "Community Stories - StoryBolt",
    description: "Discover amazing AI-generated stories from our community",
    url: "https://storybolt.vercel.app/community",
    images: [
      {
        url: "/seo/opengraph-community.png",
        width: 1200,
        height: 630,
        alt: "StoryBolt Community Stories",
      },
    ],
  },
};

export const revalidate = 300;

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; genre?: string }>;
}) => {
  const query = (await searchParams).query;
  const genre = (await searchParams).genre;

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-center">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Community{" "}
          </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Stories
          </span>
        </h1>
        <StorySearch query={query} genre={genre} type="community" />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">
                Loading community stories...
              </span>
            </div>
          }
        >
          <StoriesLoader type="community" query={query} genre={genre} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
