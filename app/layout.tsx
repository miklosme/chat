import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { PermissionDenied } from '@/components/permission-denied';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasPermission = false;
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </header>
          <main>{hasPermission ? children : <PermissionDenied />}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
