import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { EllipsisIcon, Trash2Icon, PenIcon, LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { deleteThread } from './actions';

const threadLink = cva('group block w-[235px] h-full p-1 hover:bg-muted rounded-md -ml-1', {
  variants: {
    active: {
      true: 'bg-muted',
      false: '',
    },
  },
});

export function ThreadItem({ threadId, title, isSelected }: { threadId: string; title: string; isSelected?: boolean }) {
  return (
    <Link href={`/thread/${threadId}`} className={threadLink({ active: isSelected })}>
      <span className="flex justify-between">
        <span className="truncate">{title}</span>
        <span className="opacity-0 group-hover:opacity-100">
          <ThreadMenu threadId={threadId} />
        </span>
      </span>
    </Link>
  );
}

export function ThreadMenu({ threadId }: { threadId: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pending } = useFormStatus();

  return (
    <AlertDialog>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <span>
            <EllipsisIcon className="h-5 w-5 opacity-60 hover:opacity-90" />
            <span className="sr-only">Open thread menu</span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom">
          {/* <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <PenIcon className="h-4 w-4" />
            Rename
          </DropdownMenuItem> */}
          <DropdownMenuItem className="text-red-500 flex items-center gap-2 cursor-pointer">
            <AlertDialogTrigger asChild>
              <p className="flex items-center gap-2 cursor-pointer">
                <Trash2Icon className="h-4 w-4" />
                Delete
              </p>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialogContent>
          <form action={deleteThread.bind(null, { threadId, onClose: () => setIsMenuOpen(false) })}>
            <AlertDialogHeader className="mb-10">
              <AlertDialogTitle className="text-red-500">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete this thread?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={pending}
                onClick={() => {
                  console.log('cancel');
                  setIsMenuOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button type="submit" variant="default" disabled={pending}>
                {pending ? <LoaderCircleIcon className="w-8 h-8 animate-spin" /> : 'Delete'}
              </Button>
              {/* <AlertDialogAction type="submit" disabled={pending}>
                {pending ? <LoaderCircleIcon className="w-8 h-8 animate-spin" /> : 'Delete'}
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
