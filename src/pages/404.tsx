'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

// Separate component for any potential hooks usage
function NotFoundContent() {
  const router = useRouter();
  // Any hooks would go here
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">Page Not </span>
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Found</span>
        </h1>
        <p className="text-xl mb-8 text-gray-700 leading-relaxed">
          We couldn&apos;t find the page you were looking for.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform transition hover:translate-y-[-2px] text-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default function Custom404() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 