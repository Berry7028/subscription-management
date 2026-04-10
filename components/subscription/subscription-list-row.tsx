import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { formatJpy } from "@/lib/format-currency"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

type SubscriptionListRowProps = {
  subscription: Subscription
  onStatusChange: (id: string, status: SubscriptionStatus) => void
}

export function SubscriptionListRow({
  subscription,
  onStatusChange,
}: SubscriptionListRowProps) {
  const { id, name, amountJpy, billingDayOfMonth, siteUrl, status } =
    subscription

  return (
    <Item variant="outline" size="sm">
      <ItemHeader className="items-start gap-2 sm:items-center sm:gap-3">
        <ItemContent className="min-w-0">
          <ItemTitle className="text-sm">{name}</ItemTitle>
          <ItemDescription>
            請求日: 毎月{billingDayOfMonth}日
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
