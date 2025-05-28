"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import Image from 'next/image';

const StoryBox = ({ query, genre, type }: { query?: string, genre?: string, type: string }) => {
    const { session, isLoaded: sessionLoaded } = useSession();
    const { user } = useUser();
    const [stories, setStories] = useState<{ id: string, title: string, genre: string, cover_image: string, stars: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const client = useMemo(() => {
        if (!sessionLoaded) return null;
        return createClerkSupabaseClient(session);
    }, [sessionLoaded, session]);

    useEffect(() => {
        if (!client || !user) return;
        const fetchStories = async () => {
            setLoading(true);
            try {
                // build up your query
                let builder;
                if (type === 'favorited') {
                    const { data: favoriteData, error: favoriteError } = await client
                        .from("favorites")
                        .select("book_id, favorited_at")
                        .eq("user_id", user.id)
                        .order("favorited_at", { ascending: false });
                    if (favoriteError) {
                        console.error(favoriteError);
                    }
                    console.log("favoritess", favoriteData)
                    builder = client
                        .from("books")
                        .select("id, title, genre, cover_image, favorites!book_id (count)")
                        .in("id", favoriteData?.map(f => f.book_id) || []);
                } else {
                    builder = client
                        .from("books")
                        .select("id, title, genre, cover_image, favorites!book_id (count)");
                    if (type === 'community') {
                        builder = builder
                            .eq("published", true)
                            .order("published_at", { ascending: false });
                    } else {
                        builder = builder
                            .eq("user_id", user.id)
                            .order("created_at", { ascending: false });
                    }
                }
          
                if (query) {
                  builder = builder.ilike("title", `%${query}%`);
                }
                if (genre && genre !== "All") {
                  builder = builder.eq("genre", genre);
                }
          
                // await the builder directly
                const { data, error } = await builder;
                if (error) {
                  console.error(error);
                } else {
                    // Transform the data to include the favorite count
                    const transformedData = data.map(book => ({
                        ...book,
                        stars: book.favorites?.[0]?.count || 0
                    }));
                    setStories(transformedData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStories();
    }, [type, user, client, query, genre]);

    if (loading)  return <p>Loading…</p>;
    if (!stories.length) return <p>No matching stories.</p>;

    return (
        <ul className="grid grid-cols-4 gap-4 w-[80%]">
            {stories.map(s => (
            <Link key={s.id} href={`/story/${s.id}?type=${type}&stars=${s.stars}`}>
                <Card className="p-0">
                    <CardContent className="p-0 flex flex-col">
                        <Image className="rounded-t-lg w-full" src={s.cover_image} alt={`Story ${s.id}`} width={512} height={512} />
                        <div className="p-4 pb-0 overflow-hidden min-h-[4rem]">
                            <p className="m-0 leading-tight">{s.title}</p>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <p className="text-gray-500">{s.genre}</p>
                            <p className="text-gray-500">❤️ {s.stars}</p>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            ))}
        </ul>
    )
}

export default StoryBox