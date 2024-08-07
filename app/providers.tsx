'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import { Provider as JotaiProvider } from 'jotai'
import { ClerkProvider } from '@clerk/nextjs'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </JotaiProvider>
    </ClerkProvider>
  )
}
