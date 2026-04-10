export type SubscriptionStatus = "active" | "archived"

export type Subscription = {
  id: string
  name: string
  amountJpy: number
  /** Day of month (1–31). If the month is shorter, bills on the last day. */
  billingDayOfMonth: number
  siteUrl: string
  status: SubscriptionStatus
}
