import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisIcon, Trash2Icon, PenIcon } from 'lucide-react';

export function ThreadMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>
          <EllipsisIcon className="h-5 w-5 opacity-60 hover:opacity-90" />
          <span className="sr-only">Open thread menu</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <PenIcon className="h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500 flex items-center gap-2 cursor-pointer">
          <Trash2Icon className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
