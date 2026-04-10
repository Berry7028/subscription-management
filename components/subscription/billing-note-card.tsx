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
    <Card size="sm" className="shrink-0 border-dashed">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{body}</CardDescription>
      </CardHeader>
    </Card>
  )
}
