import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type BillingNoteCardProps = {
  title?: string
  body: string
}

export function BillingNoteCard({
  title = "割引・特典",
  body,
}: BillingNoteCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
    </Card>
  )
}
