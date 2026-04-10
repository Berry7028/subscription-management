"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  buildMonthGridCells,
  effectiveBillingDay,
  subscriptionsBillingOnDay,
  WEEKDAY_LABELS_JA,
} from "@/lib/billing-calendar"
import { cn } from "@/lib/utils"
import type { Subscription } from "@/types/subscription"

type BillingCalendarPanelProps = {
  subscriptions: Subscription[]
}

function shiftMonth(year: number, monthIndex: number, delta: number) {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), monthIndex: d.getMonth() }
}

export function BillingCalendarPanel({
  subscriptions,
}: BillingCalendarPanelProps) {
  const now = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
  })

  const { year, monthIndex } = cursor
  const title = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
      }).format(new Date(year, monthIndex, 1)),
    [year, monthIndex]
  )

  const cells = useMemo(
    () => buildMonthGridCells(year, monthIndex),
    [year, monthIndex]
  )

  const today = now
  const isToday = (day: number) =>
    day === today.getDate() &&
    monthIndex === today.getMonth() &&
    year === today.getFullYear()

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 p-3 ring-1 ring-foreground/5 sm:p-4">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-semibold sm:text-base">
          {title}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="前の月"
            onClick={() =>
              setCursor((c) => shiftMonth(c.year, c.monthIndex, -1))
            }
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="次の月"
            onClick={() =>
              setCursor((c) => shiftMonth(c.year, c.monthIndex, 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className="grid shrink-0 grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground sm:gap-1 sm:text-xs"
        role="row"
      >
        {WEEKDAY_LABELS_JA.map((label) => (
          <div key={label} className="py-0.5 font-medium sm:py-1">
            {label}
          </div>
        ))}
      </div>

      <div
        className="mt-0.5 grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-7 gap-0.5 sm:mt-1 sm:gap-1"
        role="grid"
        aria-label="請求日カレンダー"
      >
        {cells.map((cell, i) => {
          if (cell.kind === "empty") {
            return <div key={`e-${i}`} className="min-h-0 rounded-md" />
          }

          const { day } = cell
          const due = subscriptionsBillingOnDay(
            subscriptions,
            year,
            monthIndex,
            day
          )

          return (
            <div
              key={`d-${day}`}
              role="gridcell"
              className={cn(
                "flex min-h-0 flex-col overflow-hidden rounded-md border border-transparent p-0.5 text-left text-xs transition-colors sm:p-1 sm:text-sm",
                isToday(day) && "border-primary/40 bg-primary/5",
                due.length > 0 && "bg-muted/40"
              )}
            >
              <span
                className={cn(
                  "tabular-nums",
                  isToday(day) && "font-semibold text-primary"
                )}
              >
                {day}
              </span>
              {due.length > 0 ? (
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {due.slice(0, 2).map((sub) => (
                    <li
                      key={sub.id}
                      className={cn(
                        "truncate rounded px-0.5 text-[10px] leading-tight",
                        sub.status === "active"
                          ? "bg-primary/15 text-foreground"
                          : "bg-muted text-muted-foreground line-through decoration-muted-foreground/60"
                      )}
                      title={`${sub.name}（毎月${effectiveBillingDay(year, monthIndex, sub.billingDayOfMonth)}日）`}
                    >
                      {sub.name}
                    </li>
                  ))}
                  {due.length > 2 ? (
                    <li className="text-[10px] text-muted-foreground">
                      +{due.length - 2}
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>

      <p className="sr-only">
        利用中は強調、解約済みは取り消し線で表示します。日付はその月の実請求日（月末調整あり）です。
      </p>
    </div>
  )
}
