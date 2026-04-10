"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import {
  BILLING_INTERVAL_LABELS,
  BILLING_INTERVAL_UNIT_SHORT,
  amountToMonthlyEquivalentJpy,
} from "@/lib/billing-interval"
import { formatJpy } from "@/lib/format-currency"
import { getSubscriptionCategoryLabel } from "@/lib/subscription-categories"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

type SubscriptionListRowProps = {
  subscription: Subscription
  onStatusChange: (
    id: string,
    status: SubscriptionStatus
  ) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  statusChangePending?: boolean
  deletePending?: boolean
}

function billingScheduleLabel(sub: Subscription): string {
  const { billingInterval, billingDayOfMonth, billingMonth } = sub
  if (billingInterval === "monthly") {
    return `毎月${billingDayOfMonth}日`
  }
  if (billingInterval === "yearly") {
    return `年1回 ${billingMonth}月${billingDayOfMonth}日`
  }
  return `四半期（起点${billingMonth}月） 各${billingDayOfMonth}日`
}

export function SubscriptionListRow({
  subscription,
  onStatusChange,
  onDelete,
  statusChangePending = false,
  deletePending = false,
}: SubscriptionListRowProps) {
  const { id, name, amountJpy, billingInterval, siteUrl, status, categoryId } =
    subscription

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const categoryLabel = getSubscriptionCategoryLabel(categoryId)
  const intervalLabel = BILLING_INTERVAL_LABELS[billingInterval]
  const monthlyEq = amountToMonthlyEquivalentJpy(amountJpy, billingInterval)
  const schedule = billingScheduleLabel(subscription)

  function handleDeleteDialogOpenChange(open: boolean) {
    setDeleteDialogOpen(open)
    if (open) {
      setDeleteError(null)
    }
  }

  async function handleConfirmDelete() {
    setDeleteError(null)
    try {
      await onDelete(id)
      setDeleteDialogOpen(false)
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "削除に失敗しました")
    }
  }

  return (
    <>
      <Item variant="outline" size="sm">
        <ItemHeader className="items-start gap-2 sm:items-center sm:gap-3">
          <ItemContent className="min-w-0">
            <ItemTitle className="flex flex-wrap items-center gap-1.5 text-sm">
              <span>{name}</span>
              <span className="rounded-md bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
                {categoryLabel}
              </span>
            </ItemTitle>
            <ItemDescription>
              {intervalLabel} {formatJpy(amountJpy)}
              {billingInterval !== "monthly"
                ? `（月換算 約${formatJpy(monthlyEq)}）`
                : null}
              <br />
              {schedule}
              {status === "archived" ? " · いまは使っていない" : null}
              {" · "}
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                公式サイト
              </a>
            </ItemDescription>
          </ItemContent>
          <ItemActions className="shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-sm font-semibold tabular-nums sm:text-base">
              {formatJpy(amountJpy)}
              <span className="block text-[10px] font-normal text-muted-foreground sm:ml-1 sm:inline sm:text-xs">
                /{BILLING_INTERVAL_UNIT_SHORT[billingInterval]}
              </span>
            </span>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                disabled={statusChangePending || deletePending}
                aria-label={`${name}を削除`}
                onClick={() => handleDeleteDialogOpenChange(true)}
              >
                <Trash2 className="size-3.5" />
              </Button>
              {status === "active" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="whitespace-nowrap"
                  disabled={statusChangePending}
                  onClick={() => void onStatusChange(id, "archived")}
                >
                  {statusChangePending ? "更新中…" : "いまは使っていない"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="whitespace-nowrap"
                  disabled={statusChangePending}
                  onClick={() => void onStatusChange(id, "active")}
                >
                  {statusChangePending ? "更新中…" : "利用中にする"}
                </Button>
              )}
            </div>
          </ItemActions>
        </ItemHeader>
      </Item>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogOpenChange}
      >
        <DialogContent
          className="shadow-xl sm:max-w-sm"
          showCloseButton
          overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-sm"
        >
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
            <DialogDescription>
              「{name}」を一覧から削除します。この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter className="gap-2 border-0 bg-transparent p-0 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={deletePending}
              onClick={() => handleDeleteDialogOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletePending}
              onClick={() => void handleConfirmDelete()}
            >
              {deletePending ? "削除中…" : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
