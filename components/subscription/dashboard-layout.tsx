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
        "flex h-full min-h-0 w-full max-w-none flex-col overflow-hidden px-4 py-3 sm:px-6 lg:px-8 lg:py-4",
        className
      )}
    >
      {children}
    </main>
  )
}
