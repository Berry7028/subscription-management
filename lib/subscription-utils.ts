import type { Subscription } from "@/types/subscription"

export function sumActiveMonthlyJpy(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.amountJpy, 0)
}

/** 学割・割引なしのときの想定合計（未設定は `amountJpy` を定価とみなす） */
export function sumActiveStandardMonthlyJpy(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + (s.standardMonthlyJpy ?? s.amountJpy), 0)
}

export function partitionSubscriptionsByStatus(subscriptions: Subscription[]) {
  const active = subscriptions.filter((s) => s.status === "active")
  const archived = subscriptions.filter((s) => s.status === "archived")
  return { active, archived }
}
