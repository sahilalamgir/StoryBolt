import { clerkClient } from '@clerk/nextjs/server';

const getAuthorName = async (authorId: string) => {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(authorId);
    return user.fullName ?? "";
}

export default getAuthorName;