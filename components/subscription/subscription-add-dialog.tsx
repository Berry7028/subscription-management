"use client"

import { useEffect, useState } from "react"

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
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { BILLING_INTERVAL_LABELS } from "@/lib/billing-interval"
import {
  SUBSCRIPTION_CATEGORY_IDS,
  SUBSCRIPTION_CATEGORY_LABELS,
} from "@/lib/subscription-categories"
import {
  parseSubscriptionForm,
  subscriptionToFormInput,
  type SubscriptionDraft,
  type SubscriptionFormErrors,
  type SubscriptionFormInput,
} from "@/lib/subscription-draft"
import { cn } from "@/lib/utils"
import type {
  BillingInterval,
  Subscription,
  SubscriptionCategoryId,
} from "@/types/subscription"

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
  "dark:bg-input/30"
)

const emptyForm: SubscriptionFormInput = {
  name: "",
  categoryId: "other",
  billingInterval: "monthly",
  amountJpy: "",
  standardAmountJpy: "",
  billingDayOfMonth: "",
  billingMonth: "1",
  siteUrl: "",
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1)

type SubscriptionAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null のときは新規追加、指定時はその内容で編集 */
  initialSubscription: Subscription | null
  onSave: (
    draft: SubscriptionDraft,
    existingId: string | null
  ) => void | Promise<void>
}

export function SubscriptionAddDialog({
  open,
  onOpenChange,
  initialSubscription,
  onSave,
}: SubscriptionAddDialogProps) {
  const [form, setForm] = useState<SubscriptionFormInput>(emptyForm)
  const [errors, setErrors] = useState<SubscriptionFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isEdit = initialSubscription !== null

  useEffect(() => {
    if (!open) {
      return
    }
    setForm(
      initialSubscription
        ? subscriptionToFormInput(initialSubscription)
        : emptyForm
    )
    setErrors({})
    setSubmitError(null)
  }, [open, initialSubscription])

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = parseSubscriptionForm(form, {
      status: initialSubscription?.status ?? "active",
    })
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setSubmitting(true)
    try {
      await onSave(result.draft, initialSubscription?.id ?? null)
      handleOpenChange(false)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : isEdit
            ? "保存に失敗しました"
            : "追加に失敗しました"
      )
    } finally {
      setSubmitting(false)
    }
  }

  function update<K extends keyof SubscriptionFormInput>(
    key: K,
    value: SubscriptionFormInput[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => {
      if (!e[key]) {
        return e
      }
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const showBillingMonth = form.billingInterval !== "monthly"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "サブスクリプションを編集" : "サブスクリプションを追加"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "変更を保存すると一覧にすぐ反映されます。利用中／アーカイブは一覧のボタンでも切り替えられます。"
              : "利用中として登録されます。後から一覧で状態を変更できます。"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {submitError ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          ) : null}
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="sub-name">サービス名</FieldLabel>
              <FieldContent>
                <Input
                  id="sub-name"
                  name="name"
                  autoComplete="off"
                  placeholder="例: Netflix"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                />
                <FieldError>{errors.name}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.categoryId}>
              <FieldLabel htmlFor="sub-category">カテゴリ</FieldLabel>
              <FieldDescription>円グラフの分類に使います</FieldDescription>
              <FieldContent>
                <select
                  id="sub-category"
                  name="categoryId"
                  className={selectClassName}
                  value={form.categoryId}
                  onChange={(e) =>
                    update(
                      "categoryId",
                      e.target.value as SubscriptionCategoryId
                    )
                  }
                  aria-invalid={!!errors.categoryId}
                >
                  {SUBSCRIPTION_CATEGORY_IDS.map((id) => (
                    <option key={id} value={id}>
                      {SUBSCRIPTION_CATEGORY_LABELS[id]}
                    </option>
                  ))}
                </select>
                <FieldError>{errors.categoryId}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.billingInterval}>
              <FieldLabel htmlFor="sub-interval">請求の間隔</FieldLabel>
              <FieldDescription>
                金額は、その間隔ごとの合計（例: 年額なら12か月分まとめて）
              </FieldDescription>
              <FieldContent>
                <select
                  id="sub-interval"
                  name="billingInterval"
                  className={selectClassName}
                  value={form.billingInterval}
                  onChange={(e) =>
                    update("billingInterval", e.target.value as BillingInterval)
                  }
                  aria-invalid={!!errors.billingInterval}
                >
                  {(
                    Object.keys(BILLING_INTERVAL_LABELS) as BillingInterval[]
                  ).map((key) => (
                    <option key={key} value={key}>
                      {BILLING_INTERVAL_LABELS[key]}
                    </option>
                  ))}
                </select>
                <FieldError>{errors.billingInterval}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.amountJpy}>
              <FieldLabel htmlFor="sub-amount">
                請求額（円・上記の間隔ごと）
              </FieldLabel>
              <FieldDescription>
                学割・割引適用後の、1サイクルあたりの実請求額
              </FieldDescription>
              <FieldContent>
                <Input
                  id="sub-amount"
                  name="amountJpy"
                  inputMode="numeric"
                  placeholder="例: 790"
                  value={form.amountJpy}
                  onChange={(e) => update("amountJpy", e.target.value)}
                  aria-invalid={!!errors.amountJpy}
                />
                <FieldError>{errors.amountJpy}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.standardAmountJpy}>
              <FieldLabel htmlFor="sub-standard">
                定価（円・同じ間隔単位）
              </FieldLabel>
              <FieldDescription>
                任意。空欄の場合は請求額と同じとみなします
              </FieldDescription>
              <FieldContent>
                <Input
                  id="sub-standard"
                  name="standardAmountJpy"
                  inputMode="numeric"
                  placeholder="空欄可"
                  value={form.standardAmountJpy}
                  onChange={(e) => update("standardAmountJpy", e.target.value)}
                  aria-invalid={!!errors.standardAmountJpy}
                />
                <FieldError>{errors.standardAmountJpy}</FieldError>
              </FieldContent>
            </Field>

            {showBillingMonth ? (
              <Field data-invalid={!!errors.billingMonth}>
                <FieldLabel htmlFor="sub-billing-month">
                  {form.billingInterval === "yearly"
                    ? "請求が来る月"
                    : "四半期の起点となる月"}
                </FieldLabel>
                <FieldDescription>
                  {form.billingInterval === "yearly"
                    ? "この月に年1回まとめて請求されます"
                    : "この月から3か月ごとに請求されます（例: 2月なら 2・5・8・11月）"}
                </FieldDescription>
                <FieldContent>
                  <select
                    id="sub-billing-month"
                    name="billingMonth"
                    className={selectClassName}
                    value={form.billingMonth}
                    onChange={(e) => update("billingMonth", e.target.value)}
                    aria-invalid={!!errors.billingMonth}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={String(m)}>
                        {m}月
                      </option>
                    ))}
                  </select>
                  <FieldError>{errors.billingMonth}</FieldError>
                </FieldContent>
              </Field>
            ) : null}

            <Field data-invalid={!!errors.billingDayOfMonth}>
              <FieldLabel htmlFor="sub-day">請求日（日にち）</FieldLabel>
              <FieldDescription>
                1〜31。請求が発生する月で、その月の何日に引き落としがあるか
              </FieldDescription>
              <FieldContent>
                <Input
                  id="sub-day"
                  name="billingDayOfMonth"
                  inputMode="numeric"
                  placeholder="例: 5"
                  value={form.billingDayOfMonth}
                  onChange={(e) => update("billingDayOfMonth", e.target.value)}
                  aria-invalid={!!errors.billingDayOfMonth}
                />
                <FieldError>{errors.billingDayOfMonth}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.siteUrl}>
              <FieldLabel htmlFor="sub-url">公式サイトのURL</FieldLabel>
              <FieldContent>
                <Input
                  id="sub-url"
                  name="siteUrl"
                  type="url"
                  inputMode="url"
                  placeholder="例: https://www.netflix.com"
                  value={form.siteUrl}
                  onChange={(e) => update("siteUrl", e.target.value)}
                  aria-invalid={!!errors.siteUrl}
                />
                <FieldError>{errors.siteUrl}</FieldError>
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 border-0 bg-transparent p-0 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => handleOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? isEdit
                  ? "保存中…"
                  : "追加中…"
                : isEdit
                  ? "保存する"
                  : "追加する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
