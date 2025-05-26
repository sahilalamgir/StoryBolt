import StorySearch from '@/components/StorySearch';
import StoryBox from '@/components/StoryBox';

const page = async ({ searchParams } : { searchParams: Promise<{ query?: string, genre?: string }> }) => {
    const query = (await searchParams).query;
    const genre = (await searchParams).genre;
    console.log("here", query, genre);

    return (
        <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Community </span>
                    <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Stories</span>
                </h1>
                <StorySearch query={query} genre={genre} />
                <StoryBox query={query} genre={genre} />
            </div>
        </div>
    )
}

export default page