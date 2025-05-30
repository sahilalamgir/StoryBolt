"use client";

import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const Hero = () => {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const navigateToCreate = () => {
        if (isSignedIn) {
          router.push('/generate');
        } else {
          // Show sign-in dialog or redirect to sign-in page
          document.getElementById('signin-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      };

  return (
    <section className="relative pt-32 pb-20 px-4 md:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-x-[60px]">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Unleash Your</span> <br />
                <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Imagination</span>
              </h1>
              <p className="text-xl mb-8 text-gray-700 leading-relaxed">
                Transform your ideas into captivating stories with AI-generated text and stunning visuals. Any genre, any topic, your personal storyteller awaits.
              </p>
              <button 
                onClick={navigateToCreate}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform transition hover:translate-y-[-2px] text-lg"
              >
                Start Your Story
              </button>
            </div>
            {/* Images for desktop/tablet */}
            <div className="md:w-1/2 relative h-80 md:h-[450px] hidden md:block">
              <div className="absolute -right-4 top-0 w-72 h-72 rounded-xl shadow-xl overflow-hidden transform rotate-3 bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200">
                <div className="p-4 h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-lg mb-4">
                  <Image src="/keanu.png" alt="Hero Image 1" className="w-full h-full object-cover object-top rounded-md" width={512} height={512} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                    <div className="h-3 bg-purple-200 rounded"></div>
                    <div className="h-3 bg-purple-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 bottom-0 w-72 h-72 rounded-xl shadow-xl overflow-hidden transform -rotate-6 bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200">
                <div className="p-4 h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg mb-4">
                    <Image src="/fairy.png" alt="Hero Image 2" className="w-full h-full object-cover rounded-md" width={512} height={512} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-pink-200 rounded"></div>
                    <div className="h-3 bg-pink-200 rounded w-4/5"></div>
                    <div className="h-3 bg-pink-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Overlapping images for mobile - side by side with slight overlap */}
            <div className="w-full flex justify-center mt-8 md:hidden">
              <div className="relative flex flex-row items-end justify-center w-88 h-36">
                {/* Pink card (left, slightly overlapping) */}
                <div className="w-1/2 rounded-xl shadow-xl overflow-hidden transform -rotate-6 bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 z-10 relative mr-[-24px]">
                  <div className="p-3 h-full flex flex-col">
                    <div className="h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg mb-3">
                      <Image src="/fairy.png" alt="Hero Image 2" className="w-full h-full object-cover rounded-md" width={160} height={160} />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-pink-200 rounded w-3/4"></div>
                      <div className="h-2 bg-pink-200 rounded"></div>
                      <div className="h-2 bg-pink-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
                {/* Purple card (right, slightly underlapping) */}
                <div className="w-1/2 rounded-xl shadow-xl overflow-hidden transform rotate-3 bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 relative z-0">
                  <div className="p-3 h-full flex flex-col">
                    <div className="h-20 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-lg mb-3">
                      <Image src="/keanu.png" alt="Hero Image 1" className="w-full h-full object-cover object-top rounded-md" width={160} height={160} />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-purple-200 rounded w-3/4"></div>
                      <div className="h-2 bg-purple-200 rounded"></div>
                      <div className="h-2 bg-purple-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero