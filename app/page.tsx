import { DashboardLayout } from "@/components/subscription/dashboard-layout"
import { MonthlyTotalSummary } from "@/components/subscription/monthly-total-summary"
import { StandardMonthlyEstimateCard } from "@/components/subscription/standard-monthly-estimate-card"
import { SubscriptionPageHeader } from "@/components/subscription/subscription-page-header"
import { SubscriptionsMainShell } from "@/components/subscription/subscriptions-main-shell"
import { MOCK_SUBSCRIPTIONS } from "@/lib/subscription-mock-data"
import {
  sumActiveMonthlyJpy,
  sumActiveStandardMonthlyJpy,
} from "@/lib/subscription-utils"

const billedMonthlyJpy = sumActiveMonthlyJpy(MOCK_SUBSCRIPTIONS)
const standardMonthlyJpy = sumActiveStandardMonthlyJpy(MOCK_SUBSCRIPTIONS)

export default function Page() {
  return (
    <DashboardLayout>
      <SubscriptionPageHeader />
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <SubscriptionsMainShell
          subscriptions={MOCK_SUBSCRIPTIONS}
          sidebar={
            <>
              <MonthlyTotalSummary billedMonthlyJpy={billedMonthlyJpy} />
              <StandardMonthlyEstimateCard
                standardMonthlyJpy={standardMonthlyJpy}
              />
            </>
          }
        />
      </div>
    </DashboardLayout>
  )
}
