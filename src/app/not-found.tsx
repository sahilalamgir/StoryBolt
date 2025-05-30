'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// Separate component for any potential hooks usage
function NotFoundContent() {
  // Any hooks would go here
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">Page Not </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Found</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          We couldn&apos;t find the page you were looking for.
        </p>
        <Link 
          href="/" 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-full hover:shadow-lg transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 