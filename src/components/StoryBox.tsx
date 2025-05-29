import createClerkSupabaseClient from '@/lib/supabase';
import { auth, clerkClient } from '@clerk/nextjs/server';
import StoryCard from './StoryCard';
import { useSession } from '@clerk/nextjs';

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>['session']
>;

interface StoryBoxType {
    id: string;
    title: string;
    genre: string;
    cover_image: string;
    user_id: string;
    stars: number;
}

const StoryBox = async ({ query, genre, type }: { query?: string, genre?: string, type: string }) => {
    // 1) Grab Clerk’s session (with cookies) on the server
    const { getToken, userId } = await auth();

    // 2) Spin up your Clerk-aware Supabase client
    const supabase = createClerkSupabaseClient({
        // mimic the “session” shape expected by createClerkSupabaseClient
        getToken: () => getToken({ template: "supabase" }),
    } as SignedInSessionResource | null | undefined);

    let stories: StoryBoxType[] = [];
    try {
        let builder;
        if (type === 'favorited') {
            const { data: favoriteData, error: favoriteError } = await supabase
                .from("favorites")
                .select("book_id, favorited_at")
                .eq("user_id", userId)
                .order("favorited_at", { ascending: false });
            if (favoriteError) {
                console.error(favoriteError);
            }
            builder = supabase
                .from("books")
                .select("id, title, genre, cover_image, user_id, favorites!book_id (count)")
                .in("id", favoriteData?.map(f => f.book_id) || []);
        } else {
            builder = supabase
                .from("books")
                .select("id, title, genre, cover_image, user_id, favorites!book_id (count)");
            if (type === 'community') {
                builder = builder
                    .eq("published", true)
                    .order("published_at", { ascending: false });
            } else {
                builder = builder
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });
            }
        }
    
        if (query) {
            builder = builder.ilike("title", `%${query}%`);
        }
        if (genre && genre !== "All") {
            builder = builder.eq("genre", genre);
        }
    
        const { data, error } = await builder;
        if (error) {
            console.error(error);
        } else {
            // Transform the data to include the favorite count
            const transformedData = data.map(book => ({
                ...book,
                stars: book.favorites?.[0]?.count || 0
            }));
            stories = transformedData;
        }
    } catch (err) {
        console.error(err);
    }

    const clerk = await clerkClient();
    const fullNames = await Promise.all(stories.map(async (s) => {
        const user = await clerk.users.getUser(s.user_id);
        return user.fullName;
    }))

    if (!stories.length) return <p>No matching stories.</p>;

    return (
        <ul className="grid grid-cols-4 gap-4 w-[80%]">
            {stories.map((s, i) => ({...s, fullName: fullNames[i]})).map(s => (
                <StoryCard key={s.id} s={s} type={type} />
            ))}
        </ul>
    )
}

export default StoryBox