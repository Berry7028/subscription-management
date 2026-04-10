import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchMutation, fetchQuery } from "convex/nextjs"
import { NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { docToSubscription } from "@/lib/convex-subscription-map"
import { isSubscriptionCategoryId } from "@/lib/subscription-categories"
import type { BillingInterval, SubscriptionStatus } from "@/types/subscription"

const BILLING: BillingInterval[] = ["monthly", "quarterly", "yearly"]
const STATUS: SubscriptionStatus[] = ["active", "archived"]

function isBillingInterval(v: string): v is BillingInterval {
  return (BILLING as readonly string[]).includes(v)
}

function isStatus(v: string): v is SubscriptionStatus {
  return (STATUS as readonly string[]).includes(v)
}

export async function GET() {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }
  try {
    let rows = await fetchQuery(api.subscriptions.list, {}, { token })
    if (rows.length === 0) {
      await fetchMutation(api.subscriptions.seedDemoIfEmpty, {}, { token })
      rows = await fetchQuery(api.subscriptions.list, {}, { token })
    }
    return NextResponse.json(rows.map(docToSubscription))
  } catch (e) {
    const message = e instanceof Error ? e.message : "取得に失敗しました"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 })
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 })
  }
  const o = body as Record<string, unknown>
  const name = typeof o.name === "string" ? o.name : ""
  const categoryId = typeof o.categoryId === "string" ? o.categoryId : ""
  const billingInterval =
    typeof o.billingInterval === "string" ? o.billingInterval : ""
  const siteUrl = typeof o.siteUrl === "string" ? o.siteUrl : ""
  const status = typeof o.status === "string" ? o.status : "active"

  if (!isSubscriptionCategoryId(categoryId)) {
    return NextResponse.json({ error: "カテゴリが不正です" }, { status: 400 })
  }
  if (!isBillingInterval(billingInterval)) {
    return NextResponse.json({ error: "請求間隔が不正です" }, { status: 400 })
  }
  if (!isStatus(status)) {
    return NextResponse.json({ error: "状態が不正です" }, { status: 400 })
  }

  const amountJpy = typeof o.amountJpy === "number" ? o.amountJpy : NaN
  const billingDayOfMonth =
    typeof o.billingDayOfMonth === "number" ? o.billingDayOfMonth : NaN
  const billingMonth = typeof o.billingMonth === "number" ? o.billingMonth : NaN
  let standardAmountJpy: number | undefined
  if (o.standardAmountJpy !== undefined && o.standardAmountJpy !== null) {
    if (typeof o.standardAmountJpy !== "number") {
      return NextResponse.json({ error: "定価が不正です" }, { status: 400 })
    }
    standardAmountJpy = o.standardAmountJpy
  }

  try {
    const id = await fetchMutation(
      api.subscriptions.add,
      {
        name,
        categoryId,
        billingInterval,
        amountJpy,
        standardAmountJpy,
        billingDayOfMonth,
        billingMonth,
        siteUrl,
        status,
      },
      { token }
    )
    const rows = await fetchQuery(api.subscriptions.list, {}, { token })
    const created = rows.find((r) => r._id === id)
    if (!created) {
      return NextResponse.json(
        { error: "作成後の取得に失敗しました" },
        { status: 500 }
      )
    }
    return NextResponse.json(docToSubscription(created))
  } catch (e) {
    const message = e instanceof Error ? e.message : "追加に失敗しました"
    const statusCode = message.includes("認証") ? 401 : 400
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function PATCH(request: Request) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 })
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 })
  }
  const o = body as Record<string, unknown>
  const id = typeof o.id === "string" ? o.id : ""
  const status = typeof o.status === "string" ? o.status : ""
  if (!id || !isStatus(status)) {
    return NextResponse.json(
      { error: "id または status が不正です" },
      { status: 400 }
    )
  }
  try {
    await fetchMutation(
      api.subscriptions.setStatus,
      { id: id as Id<"subscriptions">, status },
      { token }
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "更新に失敗しました"
    const statusCode = message.includes("認証")
      ? 401
      : message.includes("見つかりません")
        ? 404
        : 400
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function DELETE(request: Request) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 })
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 })
  }
  const o = body as Record<string, unknown>
  const id = typeof o.id === "string" ? o.id : ""
  if (!id) {
    return NextResponse.json({ error: "id が不正です" }, { status: 400 })
  }
  try {
    await fetchMutation(
      api.subscriptions.remove,
      { id: id as Id<"subscriptions"> },
      { token }
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "削除に失敗しました"
    const statusCode = message.includes("認証")
      ? 401
      : message.includes("見つかりません")
        ? 404
        : 400
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
