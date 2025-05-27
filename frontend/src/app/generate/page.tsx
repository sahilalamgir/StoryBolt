// app/generate/page.tsx

import StoryForm from "@/components/StoryForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-5xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Create Your
          </span>{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Story
          </span>
        </h1>
        <StoryForm />
      </div>
    </div>
  );
}
