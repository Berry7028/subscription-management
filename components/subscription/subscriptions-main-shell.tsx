"use client"

import type { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

import { BillingCalendarPanel } from "./billing-calendar-panel"
import { SubscriptionListPanel } from "./subscription-list-panel"

type SubscriptionsMainShellProps = {
  sidebar: ReactNode
  subscriptions: Subscription[]
  onRequestAdd: () => void
  onSubscriptionStatusChange: (id: string, status: SubscriptionStatus) => void
}

export function SubscriptionsMainShell({
  sidebar,
  subscriptions,
  onRequestAdd,
  onSubscriptionStatusChange,
}: SubscriptionsMainShellProps) {
  return (
    <Tabs
      defaultValue="list"
      className="flex h-full min-h-0 w-full flex-1 flex-col"
    >
      <div className="grid h-full min-h-0 w-full flex-1 items-stretch gap-4 lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:gap-6">
        <aside className="flex h-full min-h-0 min-w-0 flex-col gap-3 self-stretch overflow-hidden">
          {sidebar}
        </aside>

        <section className="flex h-full min-h-0 min-w-0 flex-col gap-2 self-stretch overflow-hidden">
          <div className="flex shrink-0 justify-end">
            <TabsList aria-label="表示の切り替え">
              <TabsTrigger value="list">リスト</TabsTrigger>
              <TabsTrigger value="calendar">カレンダー</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <TabsContent
              value="list"
              className="mt-0 flex h-full min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
            >
              <SubscriptionListPanel
                subscriptions={subscriptions}
                onRequestAdd={onRequestAdd}
                onSubscriptionStatusChange={onSubscriptionStatusChange}
              />
            </TabsContent>
            <TabsContent
              value="calendar"
              className="mt-0 flex h-full min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
            >
              <BillingCalendarPanel subscriptions={subscriptions} />
            </TabsContent>
          </div>
        </section>
      </div>
    </Tabs>
  )
}
