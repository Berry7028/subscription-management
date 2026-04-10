import { BillingNoteCard } from "@/components/subscription/billing-note-card"
import { DashboardLayout } from "@/components/subscription/dashboard-layout"
import { MonthlyTotalSummary } from "@/components/subscription/monthly-total-summary"
import { SubscriptionPageHeader } from "@/components/subscription/subscription-page-header"
import { SubscriptionsMainShell } from "@/components/subscription/subscriptions-main-shell"
import { MOCK_SUBSCRIPTIONS } from "@/lib/subscription-mock-data"
import { sumActiveMonthlyJpy } from "@/lib/subscription-utils"

const monthlyTotalJpy = sumActiveMonthlyJpy(MOCK_SUBSCRIPTIONS)

export default function Page() {
  return (
    <DashboardLayout>
      <SubscriptionPageHeader />
      <SubscriptionsMainShell
        subscriptions={MOCK_SUBSCRIPTIONS}
        sidebar={
          <>
            <MonthlyTotalSummary monthlyTotalJpy={monthlyTotalJpy} />
            <BillingNoteCard body="学割プランを利用中です。" />
          </>
        }
      />
    </DashboardLayout>
  )
}
