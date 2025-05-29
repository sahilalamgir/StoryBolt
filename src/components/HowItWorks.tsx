import React from 'react'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your personalized story in just three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Choose Your Genre</h3>
              <p className="text-gray-600 text-center">Fantasy, sci-fi, romance, mystery, select any genre that sparks your imagination.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Describe Your Story</h3>
              <p className="text-gray-600 text-center">Provide a brief prompt and our AI will transform it into a compelling narrative.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Enjoy Your Creation</h3>
              <p className="text-gray-600 text-center">Get a beautifully illustrated story ready to read, share, or download instantly.</p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HowItWorks