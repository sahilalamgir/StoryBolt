import { Metadata } from "next";
import StorySearch from "@/components/StorySearch";
import StoriesLoader from "@/components/StoriesLoader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Your Stories - Story History",
  description:
    "View all your AI-generated stories. Access your personal collection of stories created with StoryBolt's AI story generator.",
  keywords: [
    "my stories",
    "story history",
    "personal stories",
    "user stories",
    "story collection",
  ],
  robots: {
    index: false, // Private user content
    follow: true,
  },
};

export const revalidate = 60;

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
            Your Generated{" "}
          </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Stories
          </span>
        </h1>
        <StorySearch query={query} genre={genre} type="history" />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">
                Loading your stories...
              </span>
            </div>
          }
        >
          <StoriesLoader type="history" query={query} genre={genre} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
