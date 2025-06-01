import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-12 px-4 md:px-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-row justify-around md:justify-between items-center mb-8">
          <h3 className="text-2xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">
            StoryBolt
          </h3>
          <div className="flex flex-col md:flex-row md:gap-6">
            <Link
              href="/#features"
              className="text-indigo-200 hover:text-white transition"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-indigo-200 hover:text-white transition"
            >
              How It Works
            </Link>
            <Link
              href="/#testimonials"
              className="text-indigo-200 hover:text-white transition"
            >
              Testimonials
            </Link>
            <Link
              href="#"
              className="text-indigo-200 hover:text-white transition"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-indigo-200 hover:text-white transition"
            >
              Terms
            </Link>
          </div>
        </div>
        <div className="border-t border-indigo-800 pt-8">
          <p className="text-center text-indigo-300">
            Your imagination, our technology, together creating endless stories.
          </p>
          <p className="text-center text-sm mt-4 text-indigo-400">
            © {new Date().getFullYear()} StoryBolt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
