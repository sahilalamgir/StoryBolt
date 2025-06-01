import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

// Publish story
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();
    const { id: bookId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClerkSupabaseClient({
      getToken,
    } as SignedInSessionResource | null | undefined);

    const { error } = await supabase
      .from("books")
      .update({
        published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", bookId)
      .eq("user_id", userId); // Ensure user owns the book

    if (error) {
      console.error("Publish error:", error);
      return NextResponse.json(
        { error: "Failed to publish story" },
        { status: 500 }
      );
    }

    // Invalidate all story-related caches
    revalidateTag("stories");
    revalidateTag("story-details");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Unpublish story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();
    const { id: bookId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClerkSupabaseClient({
      getToken,
    } as SignedInSessionResource | null | undefined);

    const { error } = await supabase
      .from("books")
      .update({
        published: false,
        published_at: null,
      })
      .eq("id", bookId)
      .eq("user_id", userId); // Ensure user owns the book

    if (error) {
      console.error("Unpublish error:", error);
      return NextResponse.json(
        { error: "Failed to unpublish story" },
        { status: 500 }
      );
    }

    // Invalidate all story-related caches
    revalidateTag("stories");
    revalidateTag("story-details");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unpublish error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 