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
    <Tabs defaultValue="list" className="flex w-full flex-col gap-6">
      <TabsList aria-label="表示の切り替え">
        <TabsTrigger value="list">リスト</TabsTrigger>
        <TabsTrigger value="calendar">カレンダー</TabsTrigger>
      </TabsList>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] xl:grid-cols-[minmax(0,20rem)_1fr]">
        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6">
          {sidebar}
        </aside>

        <div className="min-w-0">
          <TabsContent value="list" className="mt-0">
            <SubscriptionListPanel subscriptions={subscriptions} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <BillingCalendarPanel subscriptions={subscriptions} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
