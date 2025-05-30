'use client';

import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface StoryCardType {
    id: string;
    title: string;
    genre: string;
    cover_image: string;
    user_id: string;
    fullName: string | null;
    stars: number;
}

const StoryCard = ({ story }: { story: StoryCardType }) => {
  return (
    <Link href={`/story/${story.id}`}>
        <Card className="p-0">
            <CardContent className="p-0 flex flex-col">
                <Image className="rounded-t-lg w-full" src={story.cover_image} alt={`Story ${story.id}`} width={512} height={512} />
                <div className="flex flex-col gap-y-2 p-4 pb-0 overflow-hidden min-h-[6rem]">
                    <p className="m-0 leading-tight font-medium">{story.title}</p>
                    <p className="text-muted-foreground italic">By {story.fullName}</p>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <p className="text-muted-foreground">{story.genre}</p>
                    <div className="flex items-center gap-1">
                        {story.stars} <Star size={18} className="text-yellow-400" fill="currentColor" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}

export default StoryCard