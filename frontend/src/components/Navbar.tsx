"use client";

import React, { useEffect, useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent" href="/">
                StoryForge AI
              </a>
            </div>
            <div className="flex gap-6 items-center">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition">Testimonials</a>
              
              {isLoaded && (
                isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => router.push('/generate')}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-full hover:shadow-lg transition"
                    >
                      Create Story
                    </button>
                    <UserButton />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button className="text-gray-700 hover:text-purple-600 font-medium">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium ml-4 py-2 px-4 rounded-full hover:shadow-lg transition">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar