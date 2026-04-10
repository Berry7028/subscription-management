import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatJpy } from "@/lib/format-currency"

export type MonthlyTotalSummaryProps = {
  /** 実際に毎月請求される合計（学割等反映後） */
  billedMonthlyJpy: number
  caption?: string
}

export function MonthlyTotalSummary({
  billedMonthlyJpy,
  caption = "年額・四半期は月あたりに換算して合算しています。学割など反映後の実質負担の目安です。",
}: MonthlyTotalSummaryProps) {
  return (
    <Card size="sm" className="shrink-0">
      <CardHeader>
        <CardTitle>請求される月額</CardTitle>
        <CardDescription className="line-clamp-2">{caption}</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="font-heading text-2xl font-semibold tracking-tight tabular-nums md:text-3xl"
          aria-live="polite"
        >
          {formatJpy(billedMonthlyJpy)}
        </p>
      </CardContent>
    </Card>
  )
}
