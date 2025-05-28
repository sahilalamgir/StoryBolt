import React from 'react'

const Showcase = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Stories That Inspire
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take a look at what our AI can create for you
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-8 pb-8 overflow-x-auto snap-x scrollbar-hide">
              {[1, 2, 3].map((item) => (
                <div key={item} className="min-w-[300px] md:min-w-[400px] snap-center">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-lg">
                    <div className="aspect-[4/3] bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg mb-4"></div>
                    <div className="space-y-2 p-2">
                      <h3 className="font-semibold text-gray-800">Adventure in the Cosmos</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">A thrilling journey through distant galaxies, where heroes discover ancient civilizations and uncover cosmic secrets...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default Showcase