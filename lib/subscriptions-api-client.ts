import type { Subscription, SubscriptionStatus } from "@/types/subscription"

import type { SubscriptionDraft } from "./subscription-draft"

async function parseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new Error("サーバーからの応答が不正です")
  }
}

export async function fetchSubscriptionsFromApi(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions", {
    method: "GET",
    credentials: "include",
  })
  const data = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "一覧の取得に失敗しました"
    throw new Error(msg)
  }
  if (!Array.isArray(data)) {
    throw new Error("一覧の形式が不正です")
  }
  return data as Subscription[]
}

export async function createSubscriptionViaApi(
  draft: SubscriptionDraft
): Promise<Subscription> {
  const res = await fetch("/api/subscriptions", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  })
  const data = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "追加に失敗しました"
    throw new Error(msg)
  }
  return data as Subscription
}

export async function setSubscriptionStatusViaApi(
  id: string,
  status: SubscriptionStatus
): Promise<void> {
  const res = await fetch("/api/subscriptions", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  })
  const data = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "更新に失敗しました"
    throw new Error(msg)
  }
}

export async function deleteSubscriptionViaApi(id: string): Promise<void> {
  const res = await fetch("/api/subscriptions", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  const data = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "削除に失敗しました"
    throw new Error(msg)
  }
}
