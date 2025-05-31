import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import SignInSection from "@/components/SignInSection";

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
