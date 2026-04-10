import type { BillingInterval } from "@/types/subscription"

export const BILLING_INTERVAL_LABELS: Record<BillingInterval, string> = {
  monthly: "毎月",
  quarterly: "四半期ごと",
  yearly: "年に1回",
}

/** 金額の単位表示用（例: ¥4,500/四半期） */
export const BILLING_INTERVAL_UNIT_SHORT: Record<BillingInterval, string> = {
  monthly: "月",
  quarterly: "四半期",
  yearly: "年",
}

export const BILLING_INTERVAL_MONTHS: Record<BillingInterval, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
}

/** 請求サイクルあたりの金額を、概算の月あたり円に換算（四捨五入） */
export function amountToMonthlyEquivalentJpy(
  amountPerCycle: number,
  interval: BillingInterval
): number {
  const months = BILLING_INTERVAL_MONTHS[interval]
  return Math.round(amountPerCycle / months)
}

export function isBillingCalendarMonth(
  interval: BillingInterval,
  billingMonth: number,
  monthIndex0to11: number
): boolean {
  const humanMonth = monthIndex0to11 + 1
  switch (interval) {
    case "monthly":
      return true
    case "quarterly": {
      const anchor = billingMonth
      const a = anchor - 1
      const m = monthIndex0to11
      return [0, 3, 6, 9].some((k) => (a + k) % 12 === m)
    }
    case "yearly":
      return billingMonth === humanMonth
  }
}

export function normalizeBillingMonth(
  interval: BillingInterval,
  raw: number | undefined
): number {
  if (interval === "monthly") {
    return 1
  }
  const m = raw ?? 1
  return Math.min(12, Math.max(1, m))
}
