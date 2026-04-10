"use client"

import { Plus } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useConvexAuth } from "convex/react"

import { Button } from "@/components/ui/button"
import { MonthlyTotalSummary } from "@/components/subscription/monthly-total-summary"
import { StandardMonthlyEstimateCard } from "@/components/subscription/standard-monthly-estimate-card"
import { SubscriptionAddDialog } from "@/components/subscription/subscription-add-dialog"
import { SubscriptionCategoryChart } from "@/components/subscription/subscription-category-chart"
import { SubscriptionsMainShell } from "@/components/subscription/subscriptions-main-shell"
import { aggregateActiveSpendByCategory } from "@/lib/subscription-category-spend"
import type { SubscriptionDraft } from "@/lib/subscription-draft"
import {
  createSubscriptionViaApi,
  deleteSubscriptionViaApi,
  fetchSubscriptionsFromApi,
  setSubscriptionStatusViaApi,
} from "@/lib/subscriptions-api-client"
import {
  sumActiveMonthlyJpy,
  sumActiveStandardMonthlyJpy,
} from "@/lib/subscription-utils"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

export function SubscriptionsDashboardClient() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [statusChangePendingId, setStatusChangePendingId] = useState<
    string | null
  >(null)
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return
    }
    let cancelled = false
    setLoadingList(true)
    setLoadError(null)
    void fetchSubscriptionsFromApi()
      .then((list) => {
        if (!cancelled) {
          setSubscriptions(list)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "一覧の取得に失敗しました"
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingList(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated])

  const openAdd = useCallback(() => setAddOpen(true), [])

  const billedMonthlyJpy = sumActiveMonthlyJpy(subscriptions)
  const standardMonthlyJpy = sumActiveStandardMonthlyJpy(subscriptions)

  const categorySlices = useMemo(
    () => aggregateActiveSpendByCategory(subscriptions),
    [subscriptions]
  )

  const handleAdd = useCallback(async (draft: SubscriptionDraft) => {
    const created = await createSubscriptionViaApi(draft)
    setSubscriptions((prev) => [...prev, created])
  }, [])

  const handleSubscriptionStatusChange = useCallback(
    async (id: string, status: SubscriptionStatus) => {
      setStatusChangePendingId(id)
      try {
        await setSubscriptionStatusViaApi(id, status)
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        )
      } finally {
        setStatusChangePendingId(null)
      }
    },
    []
  )

  const handleSubscriptionDelete = useCallback(async (id: string) => {
    setDeletePendingId(id)
    try {
      await deleteSubscriptionViaApi(id)
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setDeletePendingId(null)
    }
  }, [])

  if (authLoading || loadingList) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        読み込み中…
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </Button>
      </div>
    )
  }

  return (
    <>
      <SubscriptionAddDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
      />
      <SubscriptionsMainShell
        subscriptions={subscriptions}
        onRequestAdd={openAdd}
        onSubscriptionStatusChange={handleSubscriptionStatusChange}
        onSubscriptionDelete={handleSubscriptionDelete}
        statusChangePendingId={statusChangePendingId}
        deletePendingId={deletePendingId}
        sidebar={
          <>
            <Button
              type="button"
              className="w-full shrink-0 gap-2"
              variant="outline"
              onClick={openAdd}
            >
              <Plus className="size-4" />
              サブスクを追加
            </Button>
            <MonthlyTotalSummary billedMonthlyJpy={billedMonthlyJpy} />
            <StandardMonthlyEstimateCard
              standardMonthlyJpy={standardMonthlyJpy}
            />
            <SubscriptionCategoryChart slices={categorySlices} />
          </>
        }
      />
    </>
  )
}
