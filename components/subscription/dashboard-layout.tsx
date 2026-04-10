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
        "flex min-h-svh w-full max-w-none flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10",
        className
      )}
    >
      {children}
    </main>
  )
}
