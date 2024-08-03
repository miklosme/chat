import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { EllipsisIcon, SquarePenIcon, PanelLeftIcon } from 'lucide-react';
import { Chat } from '@/components/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db, threads } from '@/db';
import { sql, asc, desc } from 'drizzle-orm';
import Link from 'next/link';
// import { isToday, isYesterday, subDays, isBefore, isAfter } from 'date-fns';

// function categorizeDates(dates: Date[]) {
//   const today = new Date();
//   const yesterday = subDays(today, 1);
//   const sevenDaysAgo = subDays(today, 7);
//   const thirtyDaysAgo = subDays(today, 30);

//   return dates.reduce((acc, date) => {
//     if (isToday(date)) {
//       acc[0].push(date);
//     } else if (isYesterday(date)) {
//       acc[1].push(date);
//     } else if (isAfter(date, sevenDaysAgo) && isBefore(date, yesterday)) {
//       acc[2].push(date);
//     } else if (isAfter(date, thirtyDaysAgo) && isBefore(date, sevenDaysAgo)) {
//       acc[3].push(date);
//     }
//     return acc;
//   }, [[], [], [], []]);
// }

export default async function Home({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const threadsData = await db
    .select({
      id: threads.id,
      title: threads.title,
      updatedAt: threads.updatedAt,
    })
    .from(threads)
    .where(sql`${threads.ownerId} = ${user!.id}`)
    .orderBy(desc(threads.updatedAt));

  console.log('threadsData', threadsData);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col border-r border-border">
        <div className="flex items-center justify-between m-4 mt-6">
          <PanelLeftIcon className="w-6 h-6" />
          <Link href="/">
            <SquarePenIcon className="w-6 h-6" />
          </Link>
        </div>
        <ScrollArea className="flex-1 w-64">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground">Today</h2>
                <ul className="mt-2">
                  {threadsData.map((thread) => (
                    <li key={thread.id} className="">
                      <Link
                        href={`/thread/${thread.id}`}
                        className="block w-full h-full p-1 hover:bg-muted rounded-md -ml-1"
                      >
                        {thread.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground">Yesterday</h2>
                <ul className="mt-2 space-y-2">
                  <li>
                    <div className="flex items-center justify-between">
                      <span>Ideology Driven Term</span>
                      <EllipsisIcon className="w-4 h-4" />
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground">Previous 7 Days</h2>
                <ul className="mt-2 space-y-2">
                  <li>Infantilis</li>
                  <li>Practitioner Learning Scope</li>
                  <li>Creatine Overdose Risks</li>
                  <li>Ideal Sleeping Positions</li>
                  <li>Redis for Chat Apps</li>
                  <li>Frozen Shrimp Status</li>
                  <li>Book of Mormon Music</li>
                  <li>Precedent in US Law</li>
                  <li>Ukrainian Influencer Handle Inquiry</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* <Chat
        auth={
          <SignedIn>
            <UserButton />
          </SignedIn>
        }
      /> */}
      {children}
    </div>
  );
}
