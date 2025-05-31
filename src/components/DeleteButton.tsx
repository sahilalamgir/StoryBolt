"use client";

import React from "react";
import { Trash2 } from "lucide-react";

const DeleteButton = ({
  deleteFunction,
}: {
  deleteFunction: () => Promise<void>;
}) => {
  return (
    <button
      onClick={deleteFunction}
      className="flex gap-x-1.5 items-center bg-white border-2 border-red-600 text-red-600
                    font-bold py-3 px-8 rounded-xl hover:bg-red-50 active:bg-red-100 transition"
    >
      <Trash2 size={20} /> Delete Story
    </button>
  );
};

export default DeleteButton;
