import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Chat } from '@/components/chat';
import { db, threads, sql } from '@/db';

export default async function Home() {
  const user = await currentUser();
  const threadsData = await db
    .select()
    .from(threads)
    .where(sql`${threads.ownerId} = ${user!.id}`);

  return (
    <Chat
      auth={
        <SignedIn>
          <UserButton />
        </SignedIn>
      }
      threadsData={threadsData}
    />
  );
}
