"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { useSession } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';

const StoryBox = ({ query, genre }: { query?: string, genre?: string }) => {
    const { session, isLoaded } = useSession();
    const [stories, setStories] = useState<{ id: string, title: string, genre: string, cover_image: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const client = useMemo(() => {
        if (!isLoaded) return null;
        return createClerkSupabaseClient(session);
    }, [isLoaded, session]);

    useEffect(() => {
        if (!client) return;
        const fetchStories = async () => {
            setLoading(true);
            try {
                // build up your query
                let builder = client
                  .from("books")
                  .select("id, title, genre, cover_image")
                  .eq("published", true);
          
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
                  setStories(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStories();
    }, [client, query, genre]);

    if (loading)  return <p>Loading…</p>;
    if (!stories.length) return <p>No matching stories.</p>;

    return (
        <ul className="grid grid-cols-4 gap-4 w-[80%]">
            {stories.map(s => (
            <Link key={s.id} href={`/story/${s.id}`}>
                <Card className="p-0">
                <CardContent className="p-0 flex flex-col">
                    <img className="rounded-t-lg w-full" src={s.cover_image} alt="" />
                    <div className="p-4 pb-0 overflow-hidden h-[4rem]">
                        <p className="m-0 leading-tight">{s.title}</p>
                    </div>
                    <p className="p-4 text-center text-gray-500">{s.genre}</p>
                </CardContent>
                </Card>
            </Link>
            ))}
        </ul>
    )
}

export default StoryBox