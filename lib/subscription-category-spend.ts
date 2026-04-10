import { amountToMonthlyEquivalentJpy } from "@/lib/billing-interval"
import {
  getSubscriptionCategoryLabel,
  type SubscriptionCategoryId,
} from "@/lib/subscription-categories"
import type { Subscription } from "@/types/subscription"

export type CategoryMonthlySlice = {
  categoryId: SubscriptionCategoryId
  label: string
  monthlyJpy: number
  /** 利用中合計に占める割合 0–100 */
  percent: number
}

/**
 * 利用中サブスクのみ、月換算額をカテゴリ別に集計する。
 */
export function aggregateActiveSpendByCategory(
  subscriptions: Subscription[]
): CategoryMonthlySlice[] {
  const active = subscriptions.filter((s) => s.status === "active")
  const totals = new Map<SubscriptionCategoryId, number>()

  for (const s of active) {
    const monthly = amountToMonthlyEquivalentJpy(
      s.amountJpy,
      s.billingInterval
    )
    totals.set(s.categoryId, (totals.get(s.categoryId) ?? 0) + monthly)
  }

  const sum = [...totals.values()].reduce((a, b) => a + b, 0)

  return [...totals.entries()]
    .filter(([, jpy]) => jpy > 0)
    .map(([categoryId, monthlyJpy]) => ({
      categoryId,
      label: getSubscriptionCategoryLabel(categoryId),
      monthlyJpy,
      percent: sum > 0 ? (monthlyJpy / sum) * 100 : 0,
    }))
    .sort((a, b) => b.monthlyJpy - a.monthlyJpy)
}
