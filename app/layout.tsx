import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { PermissionDenied } from '@/components/permission-denied';
import { Button } from '@/components/ui/button';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <title>Chat</title>
        <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
          <SignedOut>
            <header className="m-4">
              <Button variant="outline" asChild>
                <SignInButton />
              </Button>
            </header>
          </SignedOut>
          <SignedIn>
            <Main>{children}</Main>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}

const WHITELIST = ['m.miklos05@gmail.com'];

async function Main({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const hasPermission = user?.primaryEmailAddress && WHITELIST.includes(user.primaryEmailAddress.emailAddress);

  if (!hasPermission) {
    return (
      <main className="m-4">
        <PermissionDenied />
      </main>
    );
  }

  return <main>{children}</main>;
}
