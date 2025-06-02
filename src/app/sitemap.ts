import { MetadataRoute } from 'next';
import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import { useSession } from '@clerk/nextjs';

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://storybolt.vercel.app';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  try {
    // Get published stories for sitemap
    const { getToken } = await auth();
    const supabase = createClerkSupabaseClient({
      getToken,
    } as SignedInSessionResource);

    const { data: stories } = await supabase
      .from('books')
      .select('id, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(1000); // Limit for performance

    const storyPages = stories?.map((story) => ({
      url: `${baseUrl}/story/${story.id}`,
      lastModified: new Date(story.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    return [...staticPages, ...storyPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}