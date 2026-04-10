import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatJpy } from "@/lib/format-currency"

export type StandardMonthlyEstimateCardProps = {
  /** 学割なしの場合に請求される想定の月額合計 */
  standardMonthlyJpy: number
  caption?: string
}

export function StandardMonthlyEstimateCard({
  standardMonthlyJpy,
  caption = "学割が適用されない場合の想定です。現在この金額は請求されません。",
}: StandardMonthlyEstimateCardProps) {
  return (
    <Card size="sm" className="shrink-0 border-dashed">
      <CardHeader>
        <CardTitle className="text-sm">学割なしの場合の想定</CardTitle>
        <CardDescription className="line-clamp-3">{caption}</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="font-heading text-2xl font-semibold tracking-tight text-muted-foreground tabular-nums md:text-3xl"
          aria-label={`学割なしの想定月額 ${formatJpy(standardMonthlyJpy)}`}
        >
          {formatJpy(standardMonthlyJpy)}
        </p>
      </CardContent>
    </Card>
  )
}
