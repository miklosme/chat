import { Fragment } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SquarePenIcon, PanelLeftIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ThreadMenu } from '@/components/thread-menu';
import { db, threads } from '@/db';
import { sql, asc, desc } from 'drizzle-orm';
import Link from 'next/link';
import { isToday, isYesterday, differenceInDays, format } from 'date-fns';

function makeTimeLabel(date: Date) {
  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const daysAgo = differenceInDays(new Date(), date);

  if (daysAgo < 7) {
    return 'Previous 7 Days';
  }

  if (daysAgo < 30) {
    return 'Previous 30 Days';
  }

  return format(date, 'MMM yyyy');
}

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
          {threadsData
            .map((thread) => ({ thread, timeLabel: makeTimeLabel(thread.updatedAt) }))
            .map(({ thread, timeLabel }, index, arr) => (
              <Fragment key={thread.id}>
                {index === 0 || arr[index - 1]!.timeLabel !== timeLabel ? (
                  <h2 className="text-sm font-semibold text-muted-foreground my-2">{timeLabel}</h2>
                ) : null}
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
              </Fragment>
            ))}
        </div>
      </ScrollArea>
    </>
  );
}
