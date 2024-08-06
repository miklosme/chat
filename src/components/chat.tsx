'use client';

import { type Message } from 'ai';
import { useChat } from 'ai/react';
import { UserButton } from '@clerk/nextjs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { useAtomValue } from 'jotai';
import { ModelPicker, modelAtomWithPersistence } from './model-picker';
import { AI_MODELS } from '@/lib/models';
import { OpenAIIcon, AnthropicIcon, GoogleIcon } from '@/components/icons';

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
      } else {
        revalidatePath('/thread/[id]', 'page');
      }
    },
  });

  newThreadID = (data as { threadId?: string }[])?.find((d) => d.threadId)?.threadId;

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
          {messages.map((m, index) => {
            if (m.role === 'user') {
              return (
                <div className="flex justify-end">
                  <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">{m.content}</div>
                </div>
              );
            }

            if (m.role === 'assistant') {
              const modelId = (m.annotations as Array<{ model?: string }>)?.find((a) => 'model' in a)?.model;
              const model = modelId ? AI_MODELS.find((m) => m.id === modelId) : undefined;
              return (
                <div className="flex items-start">
                  {model?.vendor === 'OpenAI' ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="mr-2">
                          <AvatarFallback>
                            <OpenAIIcon className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{modelId}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : model?.vendor === 'Anthropic' ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="mr-2">
                          <AvatarFallback>
                            <AnthropicIcon className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{modelId}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : model?.vendor === 'Google' ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="mr-2">
                          {/* <AvatarImage>
                        <GoogleIcon className="w-8 h-8 mr-2" />
                      </AvatarImage>
                      <AvatarFallback>G</AvatarFallback> */}
                          <AvatarFallback>
                            <GoogleIcon className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{modelId}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="mr-2">
                          {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unknown model</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <div>{m.content}</div>
                </div>
              );
            }

            // watch out for other role tpyes in the future
            return null;
          })}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center">
        <Input placeholder="Message" value={input} className="w-full mr-4" onChange={handleInputChange} />
        <Button>Send</Button>
      </form>
    </div>
  );
}
