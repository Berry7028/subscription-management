import Link from "next/link"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">ログイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードでサインインまたは新規登録します。パスワードは8文字以上です。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SignInForm />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            asChild
          >
            <Link href="/">トップへ（要ログイン）</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
