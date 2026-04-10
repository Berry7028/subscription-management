"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleSignOut = useCallback(async () => {
    setPending(true)
    try {
      await signOut()
      router.push("/signin")
      router.refresh()
    } finally {
      setPending(false)
    }
  }, [signOut, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5 text-muted-foreground"
      onClick={() => void handleSignOut()}
      disabled={pending}
    >
      <LogOut className="size-4" />
      {pending ? "ログアウト中…" : "ログアウト"}
    </Button>
  )
}
