"use client";

import React, { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link className="text-2xl font-bold" href="/">
              <span className="bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">
                Story
              </span>
              <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                Bolt
              </span>
            </Link>
          </div>
          {/* Desktop links */}
          <div className="hidden md:flex gap-6 items-center">
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    Home
                  </Link>
                  <Link
                    href="/history"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    History
                  </Link>
                  <Link
                    href="/favorited"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    Favorited
                  </Link>
                  <Link
                    href="/community"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    Community
                  </Link>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push("/generate")}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-full hover:shadow-lg transition"
                    >
                      Create Story
                    </button>
                    <UserButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/#features"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/#testimonials"
                    className="text-gray-700 hover:text-purple-600 transition"
                  >
                    Testimonials
                  </Link>
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
                </>
              ))}
          </div>
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <Menu size={28} color="#6366f1" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-4 top-4 w-64 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/history"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    href="/favorited"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Favorited
                  </Link>
                  <Link
                    href="/community"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <button
                    onClick={() => {
                      router.push("/generate");
                      setMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-full hover:shadow-lg transition"
                  >
                    Create Story
                  </button>
                  <div className="mt-2">
                    <UserButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/#features"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/#testimonials"
                    className="text-gray-700 hover:text-purple-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <SignInButton mode="modal">
                    <button className="text-gray-700 hover:text-purple-600 font-medium w-full text-left mt-2">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium w-full py-2 px-4 rounded-full hover:shadow-lg transition mt-2">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
