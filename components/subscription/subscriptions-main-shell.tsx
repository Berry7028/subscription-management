"use client"

import type { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Subscription } from "@/types/subscription"

import { BillingCalendarPanel } from "./billing-calendar-panel"
import { SubscriptionListPanel } from "./subscription-list-panel"

type SubscriptionsMainShellProps = {
  sidebar: ReactNode
  subscriptions: Subscription[]
}

export function SubscriptionsMainShell({
  sidebar,
  subscriptions,
}: SubscriptionsMainShellProps) {
  return (
    <Tabs
      defaultValue="list"
      className="flex min-h-0 w-full flex-1 flex-col gap-6"
    >
      <TabsList aria-label="表示の切り替え">
        <TabsTrigger value="list">リスト</TabsTrigger>
        <TabsTrigger value="calendar">カレンダー</TabsTrigger>
      </TabsList>

      <div className="grid min-h-0 w-full flex-1 items-stretch gap-6 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:gap-8">
        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          {sidebar}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-col">
          <TabsContent
            value="list"
            className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <SubscriptionListPanel subscriptions={subscriptions} />
          </TabsContent>
          <TabsContent
            value="calendar"
            className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <BillingCalendarPanel subscriptions={subscriptions} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
