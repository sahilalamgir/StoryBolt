"use client";

import React from 'react'
import { StarOff } from 'lucide-react';

const UnfavoriteButton = ({ unfavoriteFunction }: { unfavoriteFunction: () => Promise<void> }) => {
  return (
    <button
        onClick={unfavoriteFunction}
        className="flex gap-x-1.5 items-center bg-white border-2 border-indigo-600 text-indigo-600
                    font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 transition"
    >
        <StarOff size={20} />
        Unfavorite Story
    </button>
  )
}

export default UnfavoriteButton