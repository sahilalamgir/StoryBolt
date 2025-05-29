"use client";

import React from 'react'
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignInSection = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section id="signin-section" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Ready To Create Your Story?
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have already discovered the joy of personalized storytelling with AI.
          </p>
          {isLoaded && !isSignedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition hover:translate-y-[-2px]">
                  Create Free Account
                </button>
              </SignUpButton>
            </div>
          )}
          {isLoaded && isSignedIn && (
            <button 
              onClick={() => router.push('/generate')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform transition hover:translate-y-[-2px] text-lg"
            >
              Start Creating Now
            </button>
          )}
        </div>
      </section>
  )
}

export default SignInSection