import { amountToMonthlyEquivalentJpy } from "@/lib/billing-interval"
import type { Subscription } from "@/types/subscription"

/** 利用中サブスクの、月あたりに換算した実請求合計 */
export function sumActiveMonthlyJpy(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce(
      (acc, s) =>
        acc + amountToMonthlyEquivalentJpy(s.amountJpy, s.billingInterval),
      0
    )
}

/** 利用中サブスクの、月あたりに換算した定価想定合計 */
export function sumActiveStandardMonthlyJpy(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => {
      const perCycle = s.standardAmountJpy ?? s.amountJpy
      return (
        acc + amountToMonthlyEquivalentJpy(perCycle, s.billingInterval)
      )
    }, 0)
}

export function partitionSubscriptionsByStatus(subscriptions: Subscription[]) {
  const active = subscriptions.filter((s) => s.status === "active")
  const archived = subscriptions.filter((s) => s.status === "archived")
  return { active, archived }
}
