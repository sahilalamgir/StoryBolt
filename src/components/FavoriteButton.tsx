"use client";

import React from "react";
import { Star } from "lucide-react";

const FavoriteButton = ({
  favoriteFunction,
}: {
  favoriteFunction: () => Promise<void>;
}) => {
  return (
    <button
      onClick={favoriteFunction}
      className="flex gap-x-1.5 items-center bg-white border-2 border-indigo-600 text-indigo-600
                    font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 transition"
    >
      <Star size={20} /> Favorite Story
    </button>
  );
};

export default FavoriteButton;
