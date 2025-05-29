import React from 'react'

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 md:px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose StoryForge
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI-powered platform creates unique stories with matching illustrations, giving you a personalized experience unlike any other.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex items-start p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl text-white mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Advanced AI Storytelling</h3>
            <p className="text-gray-600">Our state-of-the-art AI creates cohesive, engaging narratives tailored to your specific input and preferences.</p>
          </div>
        </div>
        <div className="flex items-start p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-xl text-white mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Beautiful Illustrations</h3>
            <p className="text-gray-600">Each paragraph comes with a matching custom image, bringing your story to life with visually stunning scenes.</p>
          </div>
        </div>
        <div className="flex items-start p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl text-white mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Endless Possibilities</h3>
            <p className="text-gray-600">From fantasy to sci-fi, children&apos;s stories to mysteries, our platform adapts to any genre or theme you desire.</p>
          </div>
        </div>
        <div className="flex items-start p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl text-white mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Lightning Fast</h3>
            <p className="text-gray-600">Get your complete story with images in seconds, not hours, letting your creativity flow without interruption.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Features