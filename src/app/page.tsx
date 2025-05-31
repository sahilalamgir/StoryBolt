import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Showcase from "@/components/home/Showcase";
import Testimonials from "@/components/home/Testimonials";
import SignInSection from "@/components/SignInSection";

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
