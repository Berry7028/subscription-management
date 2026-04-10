type SubscriptionPageHeaderProps = {
  title?: string
  description?: string
}

export function SubscriptionPageHeader({
  title = "サブスクリプション管理",
  description = "月額の合計と内訳をまとめて確認できます",
}: SubscriptionPageHeaderProps) {
  return (
    <header className="mb-3 shrink-0 text-center md:text-left">
      <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:text-sm">
          {description}
        </p>
      ) : null}
    </header>
  )
}
