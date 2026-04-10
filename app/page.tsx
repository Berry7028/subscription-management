import { DashboardLayout } from "@/components/subscription/dashboard-layout"
import { SubscriptionPageHeader } from "@/components/subscription/subscription-page-header"
import { SubscriptionsDashboardClient } from "@/components/subscription/subscriptions-dashboard-client"
import { MOCK_SUBSCRIPTIONS } from "@/lib/subscription-mock-data"

export default function Page() {
  return (
    <DashboardLayout>
      <SubscriptionPageHeader />
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <SubscriptionsDashboardClient
          initialSubscriptions={MOCK_SUBSCRIPTIONS}
        />
      </div>
    </DashboardLayout>
  )
}
