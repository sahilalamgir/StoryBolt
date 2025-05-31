// src/lib/getAuthorNames.ts
import { clerkClient } from "@clerk/nextjs/server";

export async function getAuthorNames(
  userIds: string[],
): Promise<Record<string, string | null>> {
  if (userIds.length === 0) return {};

  const clerk = await clerkClient();

  try {
    // Bulk fetch all users at once - much more efficient!
    const users = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const user = await clerk.users.getUser(userId);
          return { userId, fullName: user.fullName };
        } catch (err) {
          console.error(`Failed to fetch user ${userId}:`, err);
          return { userId, fullName: null };
        }
      }),
    );

    // Convert to a lookup object
    return users.reduce(
      (acc, { userId, fullName }) => {
        acc[userId] = fullName;
        return acc;
      },
      {} as Record<string, string | null>,
    );
  } catch (err) {
    console.error("Error fetching author names:", err);
    return {};
  }
}

export async function getAuthorName(userId: string): Promise<string | null> {
  const names = await getAuthorNames([userId]);
  return names[userId] || null;
}
