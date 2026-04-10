import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { partitionSubscriptionsByStatus } from "@/lib/subscription-utils"
import type { Subscription } from "@/types/subscription"

import { SubscriptionListRow } from "./subscription-list-row"

type SubscriptionListPanelProps = {
  subscriptions: Subscription[]
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
      {children}
    </h2>
  )
}

export function SubscriptionListPanel({
  subscriptions,
}: SubscriptionListPanelProps) {
  const { active, archived } = partitionSubscriptionsByStatus(subscriptions)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 p-3 ring-1 ring-foreground/5 sm:p-4">
      <ItemGroup className="min-h-0 flex-1 gap-2 overflow-hidden">
        <SectionHeading>利用中</SectionHeading>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground">登録がありません</p>
        ) : (
          active.map((sub) => (
            <SubscriptionListRow key={sub.id} subscription={sub} />
          ))
        )}

        {archived.length > 0 ? (
          <>
            <ItemSeparator />
            <SectionHeading>以前利用していたもの</SectionHeading>
            {archived.map((sub) => (
              <SubscriptionListRow key={sub.id} subscription={sub} />
            ))}
          </>
        ) : null}
      </ItemGroup>
    </div>
  )
}
