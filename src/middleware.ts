import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

const isProtectedRoute = createRouteMatcher([
  "/generate(.*)",
  "/story(.*)",
  "/history(.*)",
  "/favorited(.*)",
  "/community(.*)",
]);

// First handle rate limiting for API routes
async function rateLimitMiddleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }
  return null; // Continue to next middleware
}

export default clerkMiddleware(async (auth, req) => {
  // First check rate limiting
  const rateLimitResponse = await rateLimitMiddleware(req);
  if (rateLimitResponse) return rateLimitResponse;

  // Then handle auth
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    // instead of Clerk’s hosted /sign-in, bounce to your home page
    const url = new URL("/", req.url);
    url.searchParams.set("openSignUp", "true");
    url.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
