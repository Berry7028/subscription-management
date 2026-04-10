import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { partitionSubscriptionsByStatus } from "@/lib/subscription-utils"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

import { SubscriptionListRow } from "./subscription-list-row"

type SubscriptionListPanelProps = {
  subscriptions: Subscription[]
  onRequestAdd: () => void
  onRequestEdit: (subscription: Subscription) => void
  onSubscriptionStatusChange: (
    id: string,
    status: SubscriptionStatus
  ) => void | Promise<void>
  onSubscriptionDelete: (id: string) => void | Promise<void>
  statusChangePendingId?: string | null
  deletePendingId?: string | null
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
  onRequestAdd,
  onRequestEdit,
  onSubscriptionStatusChange,
  onSubscriptionDelete,
  statusChangePendingId = null,
  deletePendingId = null,
}: SubscriptionListPanelProps) {
  const { active, archived } = partitionSubscriptionsByStatus(subscriptions)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 p-3 ring-1 ring-foreground/5 sm:p-4">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-sm font-medium">サブスク一覧</h2>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={onRequestAdd}
        >
          <Plus className="size-3.5" />
          追加
        </Button>
      </div>
      <ItemGroup className="min-h-0 flex-1 gap-2 overflow-hidden">
        <SectionHeading>利用中</SectionHeading>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground">登録がありません</p>
        ) : (
          active.map((sub) => (
            <SubscriptionListRow
              key={sub.id}
              subscription={sub}
              onEdit={onRequestEdit}
              onStatusChange={onSubscriptionStatusChange}
              onDelete={onSubscriptionDelete}
              statusChangePending={statusChangePendingId === sub.id}
              deletePending={deletePendingId === sub.id}
            />
          ))
        )}

        {archived.length > 0 ? (
          <>
            <ItemSeparator />
            <SectionHeading>以前利用していたもの</SectionHeading>
            {archived.map((sub) => (
              <SubscriptionListRow
                key={sub.id}
                subscription={sub}
                onEdit={onRequestEdit}
                onStatusChange={onSubscriptionStatusChange}
                onDelete={onSubscriptionDelete}
                statusChangePending={statusChangePendingId === sub.id}
                deletePending={deletePendingId === sub.id}
              />
            ))}
          </>
        ) : null}
      </ItemGroup>
    </div>
  )
}
