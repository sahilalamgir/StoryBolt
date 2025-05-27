"use client";

import { X } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

const StorySearchReset = ({ type }: { type: string }) => {
    const reset = () => {
        const form = document.querySelector('#search-form') as HTMLFormElement;

        if (form) form.reset();
    }

  return (
    <Button type="reset" onClick={reset} className='bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-full p-2'>
        <Link href={`/${type}`}>
            <X className='size-5' />
        </Link>
    </Button>
  )
}

export default StorySearchReset