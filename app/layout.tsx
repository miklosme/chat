import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { PermissionDenied } from '@/components/permission-denied'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Provider as JotaiProvider } from 'jotai'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
  sidepanel,
}: {
  children: React.ReactNode
  sidepanel: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <JotaiProvider>
        <html lang="en">
          <title>Chat</title>
          <body
            className={cn(
              'min-h-screen bg-background font-sans antialiased',
              fontSans.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delayDuration={300}>
                <SignedOut>
                  <header className="m-4">
                    <Button variant="outline" asChild>
                      <SignInButton />
                    </Button>
                  </header>
                </SignedOut>
                <SignedIn>
                  <RootLayoutContent sidepanel={sidepanel}>
                    {children}
                  </RootLayoutContent>
                </SignedIn>
              </TooltipProvider>
            </ThemeProvider>
          </body>
        </html>
      </JotaiProvider>
    </ClerkProvider>
  )
}

const WHITELIST = ['m.miklos05@gmail.com']

async function RootLayoutContent({
  children,
  sidepanel,
}: {
  children: React.ReactNode
  sidepanel: React.ReactNode
}) {
  const user = await currentUser()
  const hasPermission =
    user?.primaryEmailAddress &&
    WHITELIST.includes(user.primaryEmailAddress.emailAddress)

  if (!hasPermission) {
    return (
      <main className="m-4 dark">
        <PermissionDenied />
      </main>
    )
  }

  return (
    <div className="flex h-screen">
      <aside className="flex flex-col border-r border-border">
        {sidepanel}
      </aside>
      {children}
    </div>
  )
}
