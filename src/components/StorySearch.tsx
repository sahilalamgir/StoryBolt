import React from "react";
import Form from "next/form";
import StorySearchReset from "@/components/buttons/StorySearchReset";
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
    <div className="w-full max-w-4xl px-4 mt-6 mb-10">
      <Form
        action={`/${type}`}
        scroll={false}
        id="search-form"
        className="w-full bg-white border-2 border-gray-300 rounded-xl text-[16px] p-4 space-y-3 md:space-y-0 md:flex md:items-center md:space-x-4 md:rounded-full md:p-2"
      >
        {/* Search Input - Full width on mobile, flex-1 on desktop */}
        <div className="w-full md:flex-1 md:min-w-0">
          <input
            name="query"
            defaultValue={query}
            className="w-full placeholder-gray-400 outline-none px-3 py-3 md:px-4 md:py-1 text-base rounded-lg md:rounded-none border-0 bg-gray-50 md:bg-transparent"
            placeholder="Search for stories"
            autoComplete="off"
          />
        </div>

        {/* Mobile: Genre and Buttons Row, Desktop: Individual Elements */}
        <div className="flex items-center gap-3">
          {/* Genre Dropdown */}
          <div className="flex-1 md:flex-shrink-0">
            <select
              title="Genre"
              name="genre"
              defaultValue={genre ?? "All"}
              className="border border-gray-300 rounded-lg px-3 py-3 md:py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-white"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {(query || (genre && genre !== "All")) && (
              <StorySearchReset type={type} />
            )}

            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-full p-3 md:p-2"
            >
              <Search className="size-5" />
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default StorySearch;
