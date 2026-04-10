"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Step = "signIn" | "signUp"

export function SignInForm() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  const [step, setStep] = useState<Step>("signIn")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const toggleStep = useCallback(() => {
    setStep((s) => (s === "signIn" ? "signUp" : "signIn"))
    setError(null)
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setPending(true)
      const form = e.currentTarget
      const formData = new FormData(form)
      try {
        const result = await signIn("password", formData)
        if (result?.signingIn) {
          router.push("/")
          router.refresh()
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "サインインに失敗しました"
        setError(msg)
      } finally {
        setPending(false)
      }
    },
    [signIn, router]
  )

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="auth-email">メールアドレス</FieldLabel>
          <FieldContent>
            <Input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              aria-invalid={!!error}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="auth-password">パスワード</FieldLabel>
          <FieldContent>
            <Input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={
                step === "signUp" ? "new-password" : "current-password"
              }
              required
              minLength={8}
              placeholder="8文字以上"
            />
          </FieldContent>
        </Field>
        <input type="hidden" name="flow" value={step} readOnly />
        <FieldError>{error}</FieldError>
      </FieldGroup>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={toggleStep}
          disabled={pending}
        >
          {step === "signIn" ? "新規登録に切り替え" : "サインインに切り替え"}
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "処理中…" : step === "signIn" ? "サインイン" : "登録する"}
        </Button>
      </div>
    </form>
  )
}
