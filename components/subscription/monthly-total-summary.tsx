import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatJpy } from "@/lib/format-currency"

export type MonthlyTotalSummaryProps = {
  /** Total billed per month in JPY (integer yen). */
  monthlyTotalJpy: number
  /** Explains what the total represents (billing context). */
  caption?: string
}

export function MonthlyTotalSummary({
  monthlyTotalJpy,
  caption = "この金額は、あなたの月額料金として請求されます。",
}: MonthlyTotalSummaryProps) {
  return (
    <Card size="sm" className="shrink-0">
      <CardHeader>
        <CardTitle>月額合計</CardTitle>
        <CardDescription className="line-clamp-2">{caption}</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="font-heading text-2xl font-semibold tracking-tight tabular-nums md:text-3xl"
          aria-live="polite"
        >
          {formatJpy(monthlyTotalJpy)}
        </p>
      </CardContent>
    </Card>
  )
}
