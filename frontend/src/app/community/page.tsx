"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '@/lib/supabase';
import Link from 'next/link';

const page = () => {
    const { session, isLoaded: sessionLoaded } = useSession();
  const { user, isLoaded: userLoaded } = useUser();
  const [stories, setStories] = useState<{ id: string, title: string, genre: string, cover_image: string }[]>([]);

  const client = useMemo(() => {
    if (!sessionLoaded) return null;
    return createClerkSupabaseClient(session);
  }, [sessionLoaded, session]);

  useEffect(() => {
    if (!client) return;
    const fetchStories = async () => {
        console.log("hi")
        const { data, error } = await client
            .from("books")
            .select("id, title, genre, cover_image")
            .eq("published", true);
        if (error) console.error(error);
        else {
            console.log(data);
            setStories(data);
        }
    }
    fetchStories();
  }, [client]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Community </span>
                <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Stories</span>
            </h1>
            {stories.length === 0
                ? <p>No published stories yet.</p>
                : (
                <ul className="grid grid-cols-4 gap-4">
                    {stories.map((s) => (
                        <Link key={s.id} href={`/story/${s.id}`}>
                            <Card className="p-0">
                            <CardContent className="p-0 flex flex-col">
                                <img className="rounded-t-lg w-full" src={s.cover_image} alt={`Cover Image`} />
                                <p className="p-4 pb-0">{s.title}</p>
                                <p className="p-4 text-center text-gray-500">{s.genre}</p>
                            </CardContent>
                        </Card>
                        </Link>
                    ))}
                </ul>
                )
            }
      </div>
    </div>
  )
}

export default page