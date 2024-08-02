'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EllipsisIcon, SquarePenIcon, PanelLeftIcon } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { AI_MODELS } from '@/lib/models';
import { threads, type InferSelectModel } from '@/db';

export function Chat({
  auth,
  threadsData,
}: {
  auth: React.ReactNode;
  threadsData: InferSelectModel<typeof threads>[];
}) {
  const [model, setModel] = useState(AI_MODELS[0]!.id);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: { model },
  });

  console.log('threadsData', threadsData);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col border-r border-border">
        <div className="flex items-center justify-between m-4 mt-6">
          <PanelLeftIcon className="w-6 h-6" />
          <SquarePenIcon className="w-6 h-6" />
        </div>
        <ScrollArea className="flex-1 w-64">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground">Today</h2>
                <ul className="mt-2 space-y-2">
                  {threadsData.map((thread) => (
                    <li key={thread.id}>{thread.title}</li>
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
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger
              id="chatbot"
              aria-label="Chatbot"
              className="w-auto border-none shadow-none text-xl font-semibold"
            >
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>HE</AvatarFallback>
          </Avatar> */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {auth}
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id}>
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
    </div>
  );
}
