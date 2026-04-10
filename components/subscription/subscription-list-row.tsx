import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { formatJpy } from "@/lib/format-currency"
import type { Subscription } from "@/types/subscription"

type SubscriptionListRowProps = {
  subscription: Subscription
}

export function SubscriptionListRow({
  subscription,
}: SubscriptionListRowProps) {
  const { name, amountJpy, billingDayOfMonth, siteUrl, status } = subscription

  return (
    <Item variant="outline" size="default">
      <ItemHeader className="items-start gap-3 sm:items-center">
        <ItemContent className="min-w-0">
          <ItemTitle className="text-base">{name}</ItemTitle>
          <ItemDescription>
            請求日: 毎月{billingDayOfMonth}日
            {status === "archived" ? " · 解約済み" : null}
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
        <ItemActions className="shrink-0">
          <span className="text-base font-semibold tabular-nums">
            {formatJpy(amountJpy)}
          </span>
        </ItemActions>
      </ItemHeader>
    </Item>
  )
}
