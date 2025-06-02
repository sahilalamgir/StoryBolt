import { Metadata } from "next";
import StoryForm from "@/components/StoryForm";

export const metadata: Metadata = {
  title: "Create Your Story - AI Story Generator",
  description:
    "Start creating your personalized AI-generated story. Choose from 10+ genres and art styles. Generate stories from 5-20 pages with custom illustrations.",
  keywords: [
    "create AI story",
    "story generator form",
    "custom story creation",
    "AI story maker",
    "generate custom story",
  ],
  openGraph: {
    title: "Create Your Story - StoryBolt AI Generator",
    description:
      "Start creating your personalized AI story. Choose genre, art style, and page count.",
    url: "https://storybolt.vercel.app/generate",
    images: [
      {
        url: "/seo/opengraph-generate.png",
        width: 1200,
        height: 630,
        alt: "StoryBolt Story Creation Interface",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-5xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Create Your{" "}
          </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Story
          </span>
        </h1>
        <StoryForm />
      </div>
    </div>
  );
}
