"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatJpy } from "@/lib/format-currency"
import {
  categoryChartColorVar,
  type SubscriptionCategoryId,
} from "@/lib/subscription-categories"
import type { CategoryMonthlySlice } from "@/lib/subscription-category-spend"

const VIEWBOX = 100
const CX = VIEWBOX / 2
const CY = VIEWBOX / 2
const R = 38

function pieSlicePath(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number
): string {
  const x0 = cx + r * Math.cos(a0)
  const y0 = cy + r * Math.sin(a0)
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const sweep = a1 - a0
  const largeArc = sweep > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`
}

type SubscriptionCategoryChartProps = {
  slices: CategoryMonthlySlice[]
}

export function SubscriptionCategoryChart({
  slices,
}: SubscriptionCategoryChartProps) {
  const total = slices.reduce((acc, s) => acc + s.monthlyJpy, 0)

  if (total <= 0) {
    return (
      <Card size="sm" className="shrink-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">カテゴリ別（月換算）</CardTitle>
          <CardDescription className="line-clamp-2">
            利用中のサブスクがないため表示できません
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const paths = slices.reduce<{
    accAngle: number
    items: Array<{ categoryId: SubscriptionCategoryId; d: string }>
  }>(
    (state, s) => {
      const frac = s.monthlyJpy / total
      const start = state.accAngle
      const end = start + frac * 2 * Math.PI
      return {
        accAngle: end,
        items: [
          ...state.items,
          {
            categoryId: s.categoryId,
            d: pieSlicePath(CX, CY, R, start, end),
          },
        ],
      }
    },
    { accAngle: -Math.PI / 2, items: [] }
  ).items

  return (
    <Card size="sm" className="shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">カテゴリ別（月換算）</CardTitle>
        <CardDescription className="line-clamp-2">
          実請求を月あたりに換算した内訳です
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="mx-auto size-36 shrink-0"
          role="img"
          aria-label="カテゴリ別の月換算支出の割合"
        >
          <title>カテゴリ別支出の割合</title>
          {paths.map((p) => (
            <path
              key={p.categoryId}
              d={p.d}
              fill={categoryChartColorVar(p.categoryId)}
              stroke="var(--color-card)"
              strokeWidth={1.5}
            />
          ))}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
          {slices.map((s) => (
            <li
              key={s.categoryId}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: categoryChartColorVar(s.categoryId),
                  }}
                  aria-hidden
                />
                <span className="truncate">{s.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatJpy(s.monthlyJpy)}（{s.percent.toFixed(0)}%）
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
