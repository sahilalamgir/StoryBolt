import StorySearch from '@/components/StorySearch';
import { auth } from '@clerk/nextjs/server';
import { getStories } from '@/lib/getStories';
import StoryBox from '@/components/StoryBox';

export const revalidate = 60;

const page = async ({ searchParams } : { searchParams: Promise<{ query?: string, genre?: string }> }) => {
    const query = (await searchParams).query;
    const genre = (await searchParams).genre;

    // 1) Grab Clerk’s session (with cookies) on the server
    const { getToken, userId } = await auth();
    const stories = await getStories({ 
        type: 'community', 
        query, 
        genre, 
        userId: userId ?? undefined, 
        getToken: () => getToken({ template: "supabase" }),  
    });

    return (
        <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Community </span>
                    <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Stories</span>
                </h1>
                <StorySearch query={query} genre={genre} type='community' />
                <StoryBox stories={stories} />
            </div>
        </div>
    )
}

export default page