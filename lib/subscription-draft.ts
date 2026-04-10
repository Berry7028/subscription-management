import { normalizeBillingMonth } from "@/lib/billing-interval"
import type { BillingInterval, Subscription } from "@/types/subscription"

export type SubscriptionDraft = Omit<Subscription, "id">

export type SubscriptionFormInput = {
  name: string
  billingInterval: BillingInterval
  amountJpy: string
  standardAmountJpy: string
  billingDayOfMonth: string
  billingMonth: string
  siteUrl: string
}

export type SubscriptionFormErrors = Partial<
  Record<keyof SubscriptionFormInput | "form", string>
>

const BILLING_INTERVALS: BillingInterval[] = ["monthly", "quarterly", "yearly"]

function normalizeSiteUrl(raw: string): string {
  const t = raw.trim()
  if (!t) {
    throw new Error("empty")
  }
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`
  const parsed = new URL(withScheme)
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("invalid")
  }
  return parsed.href
}

function parseNonNegativeInt(raw: string, label: string): number {
  const n = Number.parseInt(raw.replaceAll(/[,\s]/g, ""), 10)
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(label)
  }
  return n
}

function parseBillingInterval(raw: string): BillingInterval | null {
  if (BILLING_INTERVALS.includes(raw as BillingInterval)) {
    return raw as BillingInterval
  }
  return null
}

export function parseSubscriptionForm(
  input: SubscriptionFormInput
): { ok: true; draft: SubscriptionDraft } | { ok: false; errors: SubscriptionFormErrors } {
  const errors: SubscriptionFormErrors = {}

  const name = input.name.trim()
  if (!name) {
    errors.name = "サービス名を入力してください"
  }

  const billingInterval = parseBillingInterval(input.billingInterval)
  if (!billingInterval) {
    errors.billingInterval = "請求間隔を選択してください"
  }

  let amountJpy = 0
  if (!input.amountJpy.trim()) {
    errors.amountJpy = "請求額を入力してください"
  } else {
    try {
      amountJpy = parseNonNegativeInt(input.amountJpy, "amount")
    } catch {
      errors.amountJpy = "0以上の半角整数で入力してください"
    }
  }

  let standardAmountJpy: number | undefined
  const stdRaw = input.standardAmountJpy.trim()
  if (stdRaw.length > 0) {
    try {
      const v = parseNonNegativeInt(stdRaw, "standard")
      standardAmountJpy = v
      if (!errors.amountJpy && v < amountJpy) {
        errors.standardAmountJpy =
          "定価は実請求額以上の金額を入力してください"
      }
    } catch {
      errors.standardAmountJpy = "0以上の半角整数で入力してください"
    }
  }

  let billingDayOfMonth = 0
  const dayRaw = input.billingDayOfMonth.trim()
  if (!dayRaw) {
    errors.billingDayOfMonth = "請求日（日）を入力してください"
  } else {
    billingDayOfMonth = Number.parseInt(dayRaw, 10)
    if (
      !Number.isInteger(billingDayOfMonth) ||
      billingDayOfMonth < 1 ||
      billingDayOfMonth > 31
    ) {
      errors.billingDayOfMonth = "1〜31の整数で入力してください"
    }
  }

  let billingMonth = 1
  if (billingInterval && billingInterval !== "monthly") {
    const bmRaw = input.billingMonth.trim()
    if (!bmRaw) {
      errors.billingMonth = "請求月を選択してください"
    } else {
      billingMonth = Number.parseInt(bmRaw, 10)
      if (!Number.isInteger(billingMonth) || billingMonth < 1 || billingMonth > 12) {
        errors.billingMonth = "1〜12の整数で入力してください"
      }
    }
  }

  let siteUrl = ""
  try {
    siteUrl = normalizeSiteUrl(input.siteUrl)
  } catch {
    errors.siteUrl = "有効なURLを入力してください（例: example.com）"
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const interval = billingInterval!
  const month = normalizeBillingMonth(interval, billingMonth)

  return {
    ok: true,
    draft: {
      name,
      billingInterval: interval,
      amountJpy,
      standardAmountJpy,
      billingDayOfMonth,
      billingMonth: month,
      siteUrl,
      status: "active",
    },
  }
}

export function createSubscriptionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
