import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - StoryBolt",
  description:
    "The page you're looking for doesn't exist. Return to StoryBolt to create amazing AI-generated stories.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Story Not Found
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this story got lost in the digital realm. Let&apos;s get
          you back to creating amazing stories!
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/generate"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transform transition hover:translate-y-[-2px]"
          >
            Create New Story
          </Link>
        </div>
      </div>
    </div>
  );
}
