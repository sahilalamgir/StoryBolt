"use client";

import React from "react";
import { BookX } from "lucide-react";

const UnpublishButton = ({
  unpublishFunction,
}: {
  unpublishFunction: () => Promise<void>;
}) => {
  return (
    <button
      onClick={unpublishFunction}
      className="flex gap-x-1.5 items-center bg-gradient-to-r from-purple-600 to-indigo-600
                    text-white font-bold py-3 px-8 rounded-xl shadow-lg
                    hover:shadow-xl transform transition hover:-translate-y-1"
    >
      <BookX size={20} /> Unpublish Story
    </button>
  );
};

export default UnpublishButton;
