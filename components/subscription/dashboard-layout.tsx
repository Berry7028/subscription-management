import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DashboardLayoutProps = {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <main
      className={cn(
        "mx-auto min-h-svh w-full max-w-3xl px-4 py-10 md:py-14",
        className
      )}
    >
      {children}
    </main>
  )
}
