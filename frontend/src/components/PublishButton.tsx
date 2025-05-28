"use client";

import React from 'react'
import { BookCheck } from 'lucide-react';

const PublishButton = ({ publishFunction }: { publishFunction: () => Promise<void> }) => {
  return (
    <button
        onClick={publishFunction}
        className="flex gap-x-1.5 items-center bg-gradient-to-r from-purple-600 to-indigo-600
                    text-white font-bold py-3 px-8 rounded-xl shadow-lg
                    hover:shadow-xl transform transition hover:-translate-y-1"
        >
        <BookCheck size={20} /> Publish Story
    </button>
  )
}

export default PublishButton