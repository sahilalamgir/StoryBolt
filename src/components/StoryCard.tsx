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

const StoryCard = ({ s, type }: { s: StoryCardType, type: string }) => {
  return (
    <Link href={`/story/${s.id}?type=${type}&author=${s.fullName}&stars=${s.stars}`}>
        <Card className="p-0">
            <CardContent className="p-0 flex flex-col">
                <Image className="rounded-t-lg w-full" src={s.cover_image} alt={`Story ${s.id}`} width={512} height={512} />
                <div className="flex flex-col gap-y-2 p-4 pb-0 overflow-hidden min-h-[6rem]">
                    <p className="m-0 leading-tight font-medium">{s.title}</p>
                    <p className="text-muted-foreground italic">By {s.fullName}</p>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <p className="text-muted-foreground">{s.genre}</p>
                    <div className="flex items-center gap-1">
                        {s.stars} <Star size={18} className="text-yellow-400" fill="currentColor" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}

export default StoryCard