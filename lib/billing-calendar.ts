import {
  BILLING_INTERVAL_LABELS,
  isBillingCalendarMonth,
} from "@/lib/billing-interval"
import type { Subscription } from "@/types/subscription"

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * Resolves the actual calendar day in a month for a subscription billing day
 * (e.g. day 31 → last day in February).
 */
export function effectiveBillingDay(
  year: number,
  monthIndex: number,
  billingDayOfMonth: number
): number {
  const dim = getDaysInMonth(year, monthIndex)
  return Math.min(Math.max(1, billingDayOfMonth), dim)
}

export function subscriptionBillsOnCalendarDay(
  sub: Subscription,
  year: number,
  monthIndex: number,
  calendarDay: number
): boolean {
  if (
    !isBillingCalendarMonth(
      sub.billingInterval,
      sub.billingMonth,
      monthIndex
    )
  ) {
    return false
  }
  const day = effectiveBillingDay(year, monthIndex, sub.billingDayOfMonth)
  return day === calendarDay
}

export function subscriptionsBillingOnDay(
  subscriptions: Subscription[],
  year: number,
  monthIndex: number,
  calendarDay: number
): Subscription[] {
  return subscriptions.filter((sub) =>
    subscriptionBillsOnCalendarDay(sub, year, monthIndex, calendarDay)
  )
}

export function subscriptionBillingTooltip(
  sub: Subscription,
  year: number,
  monthIndex: number
): string {
  const day = effectiveBillingDay(year, monthIndex, sub.billingDayOfMonth)
  const label = BILLING_INTERVAL_LABELS[sub.billingInterval]
  if (sub.billingInterval === "monthly") {
    return `${sub.name}（${label}・${day}日）`
  }
  if (sub.billingInterval === "yearly") {
    return `${sub.name}（${label}・${sub.billingMonth}月${day}日）`
  }
  return `${sub.name}（${label}・起点${sub.billingMonth}月・${day}日）`
}

export const WEEKDAY_LABELS_JA = ["日", "月", "火", "水", "木", "金", "土"] as const

export function buildMonthGridCells(year: number, monthIndex: number): Array<
  | { kind: "empty" }
  | { kind: "day"; day: number }
> {
  const firstDow = new Date(year, monthIndex, 1).getDay()
  const dim = getDaysInMonth(year, monthIndex)
  const cells: Array<{ kind: "empty" } | { kind: "day"; day: number }> = []

  for (let i = 0; i < firstDow; i += 1) {
    cells.push({ kind: "empty" })
  }
  for (let d = 1; d <= dim; d += 1) {
    cells.push({ kind: "day", day: d })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ kind: "empty" })
  }
  return cells
}
