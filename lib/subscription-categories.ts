export const SUBSCRIPTION_CATEGORY_IDS = [
  "streaming",
  "music",
  "dev",
  "cloud",
  "productivity",
  "other",
] as const

export type SubscriptionCategoryId = (typeof SUBSCRIPTION_CATEGORY_IDS)[number]

export const SUBSCRIPTION_CATEGORY_LABELS: Record<
  SubscriptionCategoryId,
  string
> = {
  streaming: "動画・配信",
  music: "音楽",
  dev: "開発・ホスティング",
  cloud: "クラウド・バックアップ",
  productivity: "仕事・生産性",
  other: "その他",
}

/** テーマの chart トークン（円グラフの扇形用） */
export const CATEGORY_CHART_COLOR_VARS: readonly string[] = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function getSubscriptionCategoryLabel(
  id: SubscriptionCategoryId
): string {
  return SUBSCRIPTION_CATEGORY_LABELS[id]
}

export function categoryChartColorVar(
  id: SubscriptionCategoryId
): string {
  const idx = SUBSCRIPTION_CATEGORY_IDS.indexOf(id)
  const safe = idx >= 0 ? idx : SUBSCRIPTION_CATEGORY_IDS.length - 1
  return CATEGORY_CHART_COLOR_VARS[
    safe % CATEGORY_CHART_COLOR_VARS.length
  ]!
}

export function isSubscriptionCategoryId(
  raw: string
): raw is SubscriptionCategoryId {
  return (SUBSCRIPTION_CATEGORY_IDS as readonly string[]).includes(raw)
}
