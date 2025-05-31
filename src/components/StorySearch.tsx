import React from "react";
import Form from "next/form";
import StorySearchReset from "./StorySearchReset";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const GENRES = [
  "All",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Comedy",
  "Action",
  "Adventure",
  "Horror",
  "Drama",
  "Fairy Tale",
];

const StorySearch = ({
  query,
  genre,
  type,
}: {
  query?: string;
  genre?: string;
  type: string;
}) => {
  return (
    <Form
      action={`/${type}`}
      scroll={false}
      id="search-form"
      className="max-w-xl w-full bg-white border-2 border-gray-300 rounded-full text-[16px] mt-6 mb-10 flex items-center space-x-2"
    >
      <input
        name="query"
        defaultValue={query}
        className="flex-1 placeholder-gray-400 outline-none px-4"
        placeholder="Search for stories"
        autoComplete="off"
      />

      <select
        name="genre"
        defaultValue={genre ?? "All"}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {GENRES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-2">
        {(query || (genre && genre !== "All")) && (
          <StorySearchReset type={type} />
        )}

        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-full p-2"
        >
          <Search className="size-5" />
        </Button>
      </div>
    </Form>
  );
};

export default StorySearch;
