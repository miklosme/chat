/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/WQ4gWO6usCa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EllipsisIcon, SquarePenIcon, PanelLeftIcon } from 'lucide-react';

export function Chat({ auth }: { auth: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ScrollArea className="w-64 border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <PanelLeftIcon className="w-6 h-6" />
            <SquarePenIcon className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">Today</h2>
              <ul className="mt-2 space-y-2">
                <li>Countries Using Precedent</li>
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
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Select>
            <SelectTrigger id="chatbot" aria-label="Chatbot" className="w-auto border-none shadow-none text-xl font-semibold">
              <SelectValue placeholder="ChatGPT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
            </SelectContent>
          </Select>
          {/* <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>HE</AvatarFallback>
          </Avatar> */}
          {auth}
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">
                what's a word for somebody is driven by ideology? something like "ideologe"?
              </div>
            </div>
            <div className="flex items-start">
              <Avatar className="mr-2">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>CG</AvatarFallback>
              </Avatar>
              <div>The word you're looking for is "ideologue."</div>
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200 flex items-center">
          <Input placeholder="Message ChatGPT" className="w-full mr-4" />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}