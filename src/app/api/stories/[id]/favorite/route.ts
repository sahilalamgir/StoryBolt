import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

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

    const { error } = await supabase.from("favorites").insert({
      book_id: bookId,
      user_id: userId,
    });

    if (error) {
      console.error("Favorite error:", error);
      return NextResponse.json(
        { error: "Failed to favorite story" },
        { status: 500 }
      );
    }

    // Invalidate all story-related caches
    revalidateTag("stories");
    revalidateTag("story-details");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Favorite error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      .from("favorites")
      .delete()
      .eq("book_id", bookId)
      .eq("user_id", userId);

    if (error) {
      console.error("Unfavorite error:", error);
      return NextResponse.json(
        { error: "Failed to unfavorite story" },
        { status: 500 }
      );
    }

    // Invalidate all story-related caches
    revalidateTag("stories");
    revalidateTag("story-details");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unfavorite error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 