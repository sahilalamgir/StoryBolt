import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Showcase from "@/components/home/Showcase";
import Testimonials from "@/components/home/Testimonials";
import SignInSection from "@/components/home/SignInSection";

export const metadata: Metadata = {
  title: "AI Story Generator - Create Amazing Stories Instantly | StoryBolt",
  description:
    "Generate captivating AI-powered stories in any genre. Create fantasy, sci-fi, romance, mystery stories with beautiful illustrations. Start your storytelling journey today!",
  keywords: [
    "AI story generator",
    "create stories online",
    "story writing AI",
    "generate stories free",
    "AI storytelling tool",
    "story creator",
    "creative writing AI",
  ],
  openGraph: {
    title: "StoryBolt - AI Story Generator",
    description:
      "Create amazing stories with AI in seconds. Fantasy, sci-fi, romance & more genres available!",
    url: "https://storybolt.vercel.app",
    images: [
      {
        url: "/seo/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "StoryBolt Homepage - AI Story Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryBolt - AI Story Generator",
    description:
      "Create amazing stories with AI in seconds. Fantasy, sci-fi, romance & more!",
    images: ["/seo/twitter-image.png"],
  },
  alternates: {
    canonical: "https://storybolt.vercel.app",
  },
};

// Enable Static Site Generation
export const dynamic = "force-static";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <SignInSection />
    </div>
  );
};

export default Home;
