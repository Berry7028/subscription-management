"use client"

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

const convex =
  convexUrl !== undefined && convexUrl.length > 0
    ? new ConvexReactClient(convexUrl)
    : null

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (convex === null) {
    return (
      <div className="flex h-svh items-center justify-center p-6 text-center text-sm text-muted-foreground">
        <p>
          Convex が未設定です。環境変数{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_CONVEX_URL
          </code>{" "}
          を設定してください。
        </p>
      </div>
    )
  }
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  )
}
