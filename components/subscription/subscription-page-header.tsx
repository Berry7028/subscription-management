type SubscriptionPageHeaderProps = {
  title?: string
  description?: string
}

export function SubscriptionPageHeader({
  title = "サブスクリプション管理",
  description = "月額の合計と内訳をまとめて確認できます",
}: SubscriptionPageHeaderProps) {
  return (
    <header className="mb-10 text-center md:mb-12 md:text-left">
      <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </header>
  )
}
