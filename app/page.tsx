import { DashboardLayout } from "@/components/subscription/dashboard-layout"
import { SubscriptionPageHeader } from "@/components/subscription/subscription-page-header"
import { SubscriptionsDashboardClient } from "@/components/subscription/subscriptions-dashboard-client"
import { UserMenu } from "@/components/subscription/user-menu"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-2">
        <SubscriptionPageHeader className="mb-0 flex-1 text-left" />
        <UserMenu />
      </div>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <SubscriptionsDashboardClient />
      </div>
    </DashboardLayout>
  )
}
