import { currentUser } from '@clerk/nextjs/server';
import { EllipsisIcon, SquarePenIcon, PanelLeftIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ThreadMenu } from '@/components/thread-menu';
import { db, threads } from '@/db';
import { sql, asc, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function SidePanel() {
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

  return (
    <>
      <div className="flex items-center justify-between m-4 mt-4">
        <PanelLeftIcon className="w-6 h-6" />
        <Button variant="ghost" className="p-2" asChild>
          <Link href="/">
            <SquarePenIcon className="w-6 h-6" />
          </Link>
        </Button>
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
                      className="group block w-full h-full p-1 hover:bg-muted rounded-md -ml-1"
                    >
                      <span className="flex justify-between">
                        <span className="truncate">{thread.title}</span>
                        <span className="opacity-0 group-hover:opacity-100">
                          <ThreadMenu />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div>
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
              </div> */}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
