import React from 'react';
import Image from 'next/image';

const PAGES = [
  {
    image: '/terra1.png',
    paragraph: 'After a brutal war that stretched Earth\'s resilience, the alien fleet was finally pushed back into the depths of space. Zylox, though injured and weary, became a symbol of unity between species. Governments pledged new efforts toward peaceful extraterrestrial contact and scientific exchange. The alien\'s crash, once a terrifying event, had sown the seeds of an unprecedented interstellar friendship.'
  },
  {
    image: '/terra2.png',
    paragraph: 'With the skies now calm, Zylox helped rebuild the damaged landscapes, raising structures with advanced alien engineering that harmonized with Earth\'s natural beauty. The townspeople slowly grew accustomed to their giant blue neighbor, who often walked among them, gentle despite its towering size. Children played around its feet, and Zylox shared stories of distant worlds, inspiring a new generation of explorers and scientists.'
  },
  {
    image: '/terra3.png',
    paragraph: 'The alien\'s crash had left a lasting impression on Earth. Governments and scientists scrambled to understand the technology and origins of the craft. The crash site became a symbol of hope and unity, as humanity united to explore the mysteries of the alien\'s technology and the secrets of the universe.'
  }
]


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
              Take a look at what our AI can create for you.
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-8 pb-8 overflow-x-auto snap-x scrollbar-hide">
              {PAGES.map((page, index) => (
                <div key={index} className="min-w-[300px] md:min-w-[400px] snap-center">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-lg">
                    <div className="aspect-[4/3] bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg mb-4">
                      <Image src={page.image} alt={`Showcase Image ${index}`} className="w-full h-full object-cover rounded-md" width={512} height={512} />
                    </div>
                    <div className="space-y-2 p-2">
                      <p className="text-gray-600 text-sm line-clamp-3">{page.paragraph}</p>
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