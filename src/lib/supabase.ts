import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { useSession } from '@clerk/nextjs';

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>['session']
>;

// Create a custom supabase client that injects the Clerk Supabase token into the request headers
export default function createClerkSupabaseClient(
    session: SignedInSessionResource | null | undefined
): SupabaseClient {
  return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
      global: {
          // Get the custom Supabase token from Clerk
        fetch: async (url, options = {}) => {
              // The Clerk `session` object has the getToken() method      
          const clerkToken = await session?.getToken({
              // Pass the name of the JWT template you created in the Clerk Dashboard
              // For this tutorial, you named it 'supabase'
              template: 'supabase',
          })
          
          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers)
          headers.set('Authorization', `Bearer ${clerkToken}`)
          
          // Call the default fetch
          return fetch(url, {
              ...options,
              headers,
          })
        },
      },
      auth: {
        persistSession: false, // Don't persist session since we use Clerk
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Limit realtime events
        },
      },
    },
  )
}
