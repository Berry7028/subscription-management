import { BillingNoteCard } from "@/components/subscription/billing-note-card"
import { DashboardLayout } from "@/components/subscription/dashboard-layout"
import { MonthlyTotalSummary } from "@/components/subscription/monthly-total-summary"
import { SubscriptionPageHeader } from "@/components/subscription/subscription-page-header"

/** Placeholder totals until data layer exists */
const PREVIEW_MONTHLY_TOTAL_JPY = 100_000

export default function Page() {
  return (
    <DashboardLayout>
      <SubscriptionPageHeader />
      <div className="flex flex-col gap-4">
        <MonthlyTotalSummary monthlyTotalJpy={PREVIEW_MONTHLY_TOTAL_JPY} />
        <BillingNoteCard body="学割プランを利用中です。" />
      </div>
    </DashboardLayout>
  )
}
