import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'
import NavMenu from '~/components/ui/menu-hover-effects'
import { SparklesText } from '~/components/ui/sparkles-text'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SPD ISL Kids Tournament',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-white/20">
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="shrink-0">
              <Link to="/" className="text-xl font-bold tracking-tighter text-white sm:text-2xl">
                <SparklesText 
                  text="SPD ISL KIDS" 
                  className="text-xl sm:text-2xl font-bold tracking-tighter text-white"
                  sparklesCount={5}
                  colors={{ first: "#ffffff", second: "#34d399" }}
                />
              </Link>
            </div>
            
            <div className="flex-1 flex justify-end">
              <NavMenu />
            </div>
          </nav>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="mt-20 border-t border-white/10 bg-slate-950/30 py-12 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 text-center text-slate-400 sm:px-6 lg:px-8">
            <p>© 2026 Sai Purvi Symphony (SPD) ISL Kids Tournament. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
