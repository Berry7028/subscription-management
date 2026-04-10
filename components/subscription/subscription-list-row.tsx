import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import {
  BILLING_INTERVAL_LABELS,
  BILLING_INTERVAL_UNIT_SHORT,
  amountToMonthlyEquivalentJpy,
} from "@/lib/billing-interval"
import { formatJpy } from "@/lib/format-currency"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

type SubscriptionListRowProps = {
  subscription: Subscription
  onStatusChange: (id: string, status: SubscriptionStatus) => void
}

function billingScheduleLabel(sub: Subscription): string {
  const { billingInterval, billingDayOfMonth, billingMonth } = sub
  if (billingInterval === "monthly") {
    return `毎月${billingDayOfMonth}日`
  }
  if (billingInterval === "yearly") {
    return `年1回 ${billingMonth}月${billingDayOfMonth}日`
  }
  return `四半期（起点${billingMonth}月） 各${billingDayOfMonth}日`
}

export function SubscriptionListRow({
  subscription,
  onStatusChange,
}: SubscriptionListRowProps) {
  const { id, name, amountJpy, billingInterval, siteUrl, status } = subscription

  const intervalLabel = BILLING_INTERVAL_LABELS[billingInterval]
  const monthlyEq = amountToMonthlyEquivalentJpy(amountJpy, billingInterval)
  const schedule = billingScheduleLabel(subscription)

  return (
    <Item variant="outline" size="sm">
      <ItemHeader className="items-start gap-2 sm:items-center sm:gap-3">
        <ItemContent className="min-w-0">
          <ItemTitle className="text-sm">{name}</ItemTitle>
          <ItemDescription>
            {intervalLabel} {formatJpy(amountJpy)}
            {billingInterval !== "monthly"
              ? `（月換算 約${formatJpy(monthlyEq)}）`
              : null}
            <br />
            {schedule}
            {status === "archived" ? " · いまは使っていない" : null}
            {" · "}
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              公式サイト
            </a>
          </ItemDescription>
        </ItemContent>
        <ItemActions className="shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-sm font-semibold tabular-nums sm:text-base">
            {formatJpy(amountJpy)}
            <span className="block text-[10px] font-normal text-muted-foreground sm:ml-1 sm:inline sm:text-xs">
              /{BILLING_INTERVAL_UNIT_SHORT[billingInterval]}
            </span>
          </span>
          {status === "active" ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="whitespace-nowrap"
              onClick={() => onStatusChange(id, "archived")}
            >
              いまは使っていない
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              className="whitespace-nowrap"
              onClick={() => onStatusChange(id, "active")}
            >
              利用中にする
            </Button>
          )}
        </ItemActions>
      </ItemHeader>
    </Item>
  )
}
