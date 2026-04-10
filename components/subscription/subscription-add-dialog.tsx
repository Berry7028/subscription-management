"use client"

import { useState } from "react"

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
import {
  createSubscriptionId,
  parseSubscriptionForm,
  type SubscriptionFormErrors,
  type SubscriptionFormInput,
} from "@/lib/subscription-draft"
import type { Subscription } from "@/types/subscription"

const emptyForm: SubscriptionFormInput = {
  name: "",
  amountJpy: "",
  standardMonthlyJpy: "",
  billingDayOfMonth: "",
  siteUrl: "",
}

type SubscriptionAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (subscription: Subscription) => void
}

export function SubscriptionAddDialog({
  open,
  onOpenChange,
  onAdd,
}: SubscriptionAddDialogProps) {
  const [form, setForm] = useState<SubscriptionFormInput>(emptyForm)
  const [errors, setErrors] = useState<SubscriptionFormErrors>({})

  function handleOpenChange(next: boolean) {
    if (next) {
      setForm(emptyForm)
      setErrors({})
    }
    onOpenChange(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = parseSubscriptionForm(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors({})
    onAdd({ ...result.draft, id: createSubscriptionId() })
    handleOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>サブスクリプションを追加</DialogTitle>
          <DialogDescription>
            利用中として登録されます。後から一覧で状態を変更できます。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <Field data-invalid={!!errors.amountJpy}>
              <FieldLabel htmlFor="sub-amount">請求される月額（円）</FieldLabel>
              <FieldDescription>
                学割・割引適用後の実際の請求額
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

            <Field data-invalid={!!errors.standardMonthlyJpy}>
              <FieldLabel htmlFor="sub-standard">
                定価・学割なしの月額（円）
              </FieldLabel>
              <FieldDescription>
                任意。空欄の場合は上記と同じとみなします
              </FieldDescription>
              <FieldContent>
                <Input
                  id="sub-standard"
                  name="standardMonthlyJpy"
                  inputMode="numeric"
                  placeholder="空欄可"
                  value={form.standardMonthlyJpy}
                  onChange={(e) => update("standardMonthlyJpy", e.target.value)}
                  aria-invalid={!!errors.standardMonthlyJpy}
                />
                <FieldError>{errors.standardMonthlyJpy}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.billingDayOfMonth}>
              <FieldLabel htmlFor="sub-day">請求日（毎月）</FieldLabel>
              <FieldDescription>
                1〜31（その月に日がない場合は月末）
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
              onClick={() => handleOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">追加する</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
