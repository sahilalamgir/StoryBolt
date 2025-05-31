import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import createClerkSupabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";

type SignedInSessionResource = NonNullable<
  ReturnType<typeof useSession>["session"]
>;

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, paragraphs, images, genre } = await request.json();

    if (!title || !paragraphs || !images || !genre) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create Supabase client with proper session token
    const supabase = createClerkSupabaseClient({
      getToken,
    } as SignedInSessionResource | null | undefined);

    // Check if book already exists
    const { data: existing, error: selErr } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", userId)
      .eq("title", title)
      .maybeSingle();

    if (selErr) {
      console.error("Error checking existing book:", selErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existing?.id) {
      return NextResponse.json({ bookId: existing.id });
    }

    // Insert new book
    const { data: newBook, error: insErr } = await supabase
      .from("books")
      .insert({
        user_id: userId,
        title,
        genre,
        page_count: paragraphs.length,
        cover_image: images[0],
        published: false,
      })
      .select("id")
      .single();

    if (insErr || !newBook?.id) {
      console.error("Error inserting book:", insErr);
      return NextResponse.json(
        { error: "Failed to create book" },
        { status: 500 },
      );
    }

    // Insert pages
    const pages = paragraphs.map((para: string, idx: number) => ({
      book_id: newBook.id,
      page_number: idx + 1,
      text_content: para,
      image_path: images[idx + 1],
    }));

    const { error: pagesErr } = await supabase.from("pages").insert(pages);
    if (pagesErr) {
      console.error("Error inserting pages:", pagesErr);
      return NextResponse.json(
        { error: "Failed to create pages" },
        { status: 500 },
      );
    }

    return NextResponse.json({ bookId: newBook.id });
  } catch (err) {
    console.error("Story creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
