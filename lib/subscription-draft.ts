import type { Subscription } from "@/types/subscription"

export type SubscriptionDraft = Omit<Subscription, "id">

export type SubscriptionFormInput = {
  name: string
  amountJpy: string
  standardMonthlyJpy: string
  billingDayOfMonth: string
  siteUrl: string
}

export type SubscriptionFormErrors = Partial<
  Record<keyof SubscriptionFormInput | "form", string>
>

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

export function parseSubscriptionForm(
  input: SubscriptionFormInput
): { ok: true; draft: SubscriptionDraft } | { ok: false; errors: SubscriptionFormErrors } {
  const errors: SubscriptionFormErrors = {}

  const name = input.name.trim()
  if (!name) {
    errors.name = "サービス名を入力してください"
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

  let standardMonthlyJpy: number | undefined
  const stdRaw = input.standardMonthlyJpy.trim()
  if (stdRaw.length > 0) {
    try {
      const v = parseNonNegativeInt(stdRaw, "standard")
      standardMonthlyJpy = v
      if (!errors.amountJpy && v < amountJpy) {
        errors.standardMonthlyJpy =
          "定価は実請求額以上の金額を入力してください"
      }
    } catch {
      errors.standardMonthlyJpy = "0以上の半角整数で入力してください"
    }
  }

  let billingDayOfMonth = 0
  const dayRaw = input.billingDayOfMonth.trim()
  if (!dayRaw) {
    errors.billingDayOfMonth = "請求日を入力してください"
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

  let siteUrl = ""
  try {
    siteUrl = normalizeSiteUrl(input.siteUrl)
  } catch {
    errors.siteUrl = "有効なURLを入力してください（例: example.com）"
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    draft: {
      name,
      amountJpy,
      standardMonthlyJpy,
      billingDayOfMonth,
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
