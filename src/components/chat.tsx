'use client';

import { type Message } from 'ai';
import { useChat } from 'ai/react';
import { UserButton } from '@clerk/nextjs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { ModelPicker, modelAtomWithPersistence } from './model-picker';

export const maxDuration = 60;

let newThreadID: string | undefined;

export function Chat({ threadId, initialMessages }: { threadId?: string; initialMessages?: Message[] }) {
  const router = useRouter();
  const model = useAtomValue(modelAtomWithPersistence);
  const { messages, input, data, handleInputChange, handleSubmit } = useChat({
    body: { model, threadId },
    id: threadId,
    initialMessages,
    onFinish: () => {
      if (newThreadID) {
        router.push(`/thread/${newThreadID}`);
      }
    },
  });

  if (Array.isArray(data)) {
    newThreadID = data.find((d) => d.threadId)?.threadId as string;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <ModelPicker />
        {/* <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>HE</AvatarFallback>
          </Avatar> */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <span className="w-[32px] flex align-middle">
            <UserButton />
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m, index) => (
            <div key={index}>
              {m.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">{m.content}</div>
                </div>
              ) : (
                <div className="flex items-start">
                  <Avatar className="mr-2">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>CG</AvatarFallback>
                  </Avatar>
                  <div>{m.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center">
        <Input placeholder="Message" value={input} className="w-full mr-4" onChange={handleInputChange} />
        <Button>Send</Button>
      </form>
    </div>
  );
}
