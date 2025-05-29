import React from 'react'

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-4 md:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied storytellers who&apos;ve discovered the magic of AI-powered creativity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah K.</h4>
                  <p className="text-sm text-gray-500">Elementary School Teacher</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;I use StoryBolt to create personalized stories for my students. They love seeing themselves as heroes in these incredible adventures! It&apos;s made reading time the highlight of our day.&quot;</p>
              <div className="flex text-purple-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Michael T.</h4>
                  <p className="text-sm text-gray-500">Parent of Three</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;My kids look forward to our bedtime stories every night now! I generate a new adventure with them as the main characters. The illustrations are beautiful and keep them engaged throughout.&quot;</p>
              <div className="flex text-purple-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Jamie L.</h4>
                  <p className="text-sm text-gray-500">Professional Writer</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;As a writer, I use StoryBolt to overcome creative blocks. The AI gives me fresh ideas, and the images help visualize new settings and characters. It&apos;s become an essential part of my creative process.&quot;</p>
              <div className="flex text-purple-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonials