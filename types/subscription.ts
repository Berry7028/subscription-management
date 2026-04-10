export type SubscriptionStatus = "active" | "archived"

export type Subscription = {
  id: string
  name: string
  /** 実際に請求される月額（学割・キャンペーン反映後） */
  amountJpy: number
  /**
   * 割引なしのときの想定月額。未設定のサービスは `amountJpy` を定価とみなす。
   */
  standardMonthlyJpy?: number
  /** Day of month (1–31). If the month is shorter, bills on the last day. */
  billingDayOfMonth: number
  siteUrl: string
  status: SubscriptionStatus
}
