interface Story {
  title: string;
  paragraphs: string[];
  images: string[];
  genre: string;
  stars: number;
  authorId: string;
  authorName?: string | null;
}

export default Story;
