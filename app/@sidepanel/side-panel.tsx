'use client';

import { Fragment, useState } from 'react';
import { SquarePenIcon, PanelLeftIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ThreadMenu } from '@/components/thread-menu';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const header = cva('flex items-center justify-between m-4 mt-4', {
  variants: {
    open: {
      true: 'flex-row',
      false: 'flex-col gap-2',
    },
  },
});

const threadLink = cva('group block w-full h-full p-1 hover:bg-muted rounded-md -ml-1', {
  variants: {
    active: {
      true: 'bg-muted',
      false: '',
    },
  },
});

export function SidePanel({
  threadsData,
}: {
  threadsData: Array<{ id: string; title: string; updatedAt: Date; timeLabel: string }>;
}) {
  const [open, setOpen] = useState(true);
  const params = useParams<{ id: string }>();

  return (
    <>
      <div className={header({ open })}>
        <Button variant="ghost" className="p-2" onClick={() => setOpen(!open)}>
          <PanelLeftIcon className="w-6 h-6" />
        </Button>
        <Button variant="ghost" className="p-2" asChild>
          <Link href="/">
            <SquarePenIcon className="w-6 h-6" />
          </Link>
        </Button>
      </div>
      {open ? (
        <ScrollArea className="flex-1 w-64">
          <div className="p-4">
            {threadsData.map((thread, index, arr) => (
              <Fragment key={thread.id}>
                {index === 0 || arr[index - 1]!.timeLabel !== thread.timeLabel ? (
                  <h2 className="text-sm font-semibold text-muted-foreground my-2">{thread.timeLabel}</h2>
                ) : null}
                <Link href={`/thread/${thread.id}`} className={threadLink({ active: thread.id === params.id })}>
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
      ) : null}
    </>
  );
}
