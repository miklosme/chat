'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { AI_MODELS } from '@/lib/models';

export function Chat({
  auth,
}: {
  auth: React.ReactNode;
}) {
  const [model, setModel] = useState(AI_MODELS[0]!.id);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: { model },
  });

  return (
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
  );
}
