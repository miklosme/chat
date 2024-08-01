import { Chat } from '@/components/chat';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <Chat
      auth={
        <SignedIn>
          <UserButton />
        </SignedIn>
      }
    />
  );
}
