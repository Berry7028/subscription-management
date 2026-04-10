"use client"

import { Plus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { MonthlyTotalSummary } from "@/components/subscription/monthly-total-summary"
import { StandardMonthlyEstimateCard } from "@/components/subscription/standard-monthly-estimate-card"
import { SubscriptionAddDialog } from "@/components/subscription/subscription-add-dialog"
import { SubscriptionCategoryChart } from "@/components/subscription/subscription-category-chart"
import { SubscriptionsMainShell } from "@/components/subscription/subscriptions-main-shell"
import { aggregateActiveSpendByCategory } from "@/lib/subscription-category-spend"
import {
  sumActiveMonthlyJpy,
  sumActiveStandardMonthlyJpy,
} from "@/lib/subscription-utils"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

type SubscriptionsDashboardClientProps = {
  initialSubscriptions: Subscription[]
}

export function SubscriptionsDashboardClient({
  initialSubscriptions,
}: SubscriptionsDashboardClientProps) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions)
  const [addOpen, setAddOpen] = useState(false)

  const openAdd = useCallback(() => setAddOpen(true), [])

  const billedMonthlyJpy = sumActiveMonthlyJpy(subscriptions)
  const standardMonthlyJpy = sumActiveStandardMonthlyJpy(subscriptions)

  const categorySlices = useMemo(
    () => aggregateActiveSpendByCategory(subscriptions),
    [subscriptions]
  )

  const handleAdd = useCallback((subscription: Subscription) => {
    setSubscriptions((prev) => [...prev, subscription])
  }, [])

  const handleSubscriptionStatusChange = useCallback(
    (id: string, status: SubscriptionStatus) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      )
    },
    []
  )

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
