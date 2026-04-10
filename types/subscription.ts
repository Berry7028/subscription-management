export type SubscriptionStatus = "active" | "archived"

/** 請求の間隔 */
export type BillingInterval = "monthly" | "quarterly" | "yearly"

export type Subscription = {
  id: string
  name: string
  billingInterval: BillingInterval
  /**
   * 請求サイクルごとの金額（円）。
   * 例: 月額なら1か月分、年額なら1年分。
   */
  amountJpy: number
  /**
   * 割引なしの定価（`amountJpy` と同じサイクル単位）。
   * 未設定のときは `amountJpy` を定価とみなす。
   */
  standardAmountJpy?: number
  /** 請求日（月の何日目か）。月が短い月は月末に寄せる。 */
  billingDayOfMonth: number
  /**
   * 四半期: サイクルの起点となる月（1–12）。3か月ごとにその月から繰り返す。
   * 年1回: 請求が発生する月（1–12）。
   * 毎月: 未使用（保存上は 1 を推奨）。
   */
  billingMonth: number
  siteUrl: string
  status: SubscriptionStatus
}
