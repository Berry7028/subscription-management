import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

const categoryIdV = v.union(
  v.literal("streaming"),
  v.literal("music"),
  v.literal("dev"),
  v.literal("cloud"),
  v.literal("productivity"),
  v.literal("other")
)

const billingIntervalV = v.union(
  v.literal("monthly"),
  v.literal("quarterly"),
  v.literal("yearly")
)

const statusV = v.union(v.literal("active"), v.literal("archived"))

const subscriptionArgs = {
  name: v.string(),
  categoryId: categoryIdV,
  billingInterval: billingIntervalV,
  amountJpy: v.number(),
  standardAmountJpy: v.optional(v.number()),
  billingDayOfMonth: v.number(),
  billingMonth: v.number(),
  siteUrl: v.string(),
  status: statusV,
}

async function requireUserId(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new Error("認証が必要です")
  }
  return userId
}

function assertValidSubscriptionInput(args: {
  name: string
  amountJpy: number
  standardAmountJpy?: number
  billingDayOfMonth: number
  billingMonth: number
}) {
  const name = args.name.trim()
  if (!name) {
    throw new Error("サービス名が無効です")
  }
  if (!Number.isFinite(args.amountJpy) || args.amountJpy < 0) {
    throw new Error("請求額が無効です")
  }
  if (
    args.standardAmountJpy !== undefined &&
    (!Number.isFinite(args.standardAmountJpy) ||
      args.standardAmountJpy < args.amountJpy)
  ) {
    throw new Error("定価が無効です")
  }
  if (
    !Number.isInteger(args.billingDayOfMonth) ||
    args.billingDayOfMonth < 1 ||
    args.billingDayOfMonth > 31
  ) {
    throw new Error("請求日が無効です")
  }
  if (
    !Number.isInteger(args.billingMonth) ||
    args.billingMonth < 1 ||
    args.billingMonth > 12
  ) {
    throw new Error("請求月が無効です")
  }
}

/** 初回のみ、デモ用データを投入（既存行がある場合は何もしない） */
const DEMO_ROWS: Array<{
  name: string
  categoryId: "streaming" | "music" | "dev" | "cloud" | "productivity" | "other"
  billingInterval: "monthly" | "quarterly" | "yearly"
  amountJpy: number
  standardAmountJpy?: number
  billingDayOfMonth: number
  billingMonth: number
  siteUrl: string
  status: "active" | "archived"
}> = [
  {
    name: "Netflix",
    categoryId: "streaming",
    billingInterval: "monthly",
    amountJpy: 790,
    standardAmountJpy: 1490,
    billingDayOfMonth: 5,
    billingMonth: 1,
    siteUrl: "https://www.netflix.com",
    status: "active",
  },
  {
    name: "Spotify",
    categoryId: "music",
    billingInterval: "monthly",
    amountJpy: 480,
    standardAmountJpy: 980,
    billingDayOfMonth: 12,
    billingMonth: 1,
    siteUrl: "https://www.spotify.com",
    status: "active",
  },
  {
    name: "GitHub",
    categoryId: "dev",
    billingInterval: "monthly",
    amountJpy: 300,
    standardAmountJpy: 550,
    billingDayOfMonth: 28,
    billingMonth: 1,
    siteUrl: "https://github.com",
    status: "active",
  },
  {
    name: "クラウドバックアップ（年契約）",
    categoryId: "cloud",
    billingInterval: "yearly",
    amountJpy: 9800,
    standardAmountJpy: 11800,
    billingDayOfMonth: 1,
    billingMonth: 4,
    siteUrl: "https://example.com",
    status: "active",
  },
  {
    name: "開発ツール（四半期）",
    categoryId: "dev",
    billingInterval: "quarterly",
    amountJpy: 4500,
    billingDayOfMonth: 15,
    billingMonth: 2,
    siteUrl: "https://example.com",
    status: "active",
  },
  {
    name: "Adobe CC",
    categoryId: "productivity",
    billingInterval: "monthly",
    amountJpy: 6780,
    billingDayOfMonth: 15,
    billingMonth: 1,
    siteUrl: "https://www.adobe.com",
    status: "archived",
  },
  {
    name: "Dropbox",
    categoryId: "cloud",
    billingInterval: "monthly",
    amountJpy: 1200,
    billingDayOfMonth: 1,
    billingMonth: 1,
    siteUrl: "https://www.dropbox.com",
    status: "archived",
  },
]

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const add = mutation({
  args: subscriptionArgs,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    assertValidSubscriptionInput(args)
    const name = args.name.trim()
    return await ctx.db.insert("subscriptions", {
      userId,
      name,
      categoryId: args.categoryId,
      billingInterval: args.billingInterval,
      amountJpy: args.amountJpy,
      standardAmountJpy: args.standardAmountJpy,
      billingDayOfMonth: args.billingDayOfMonth,
      billingMonth: args.billingMonth,
      siteUrl: args.siteUrl.trim(),
      status: args.status,
    })
  },
})

export const setStatus = mutation({
  args: {
    id: v.id("subscriptions"),
    status: statusV,
  },
  handler: async (ctx, { id, status }) => {
    const userId = await requireUserId(ctx)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) {
      throw new Error("サブスクリプションが見つかりません")
    }
    await ctx.db.patch(id, { status })
  },
})

export const remove = mutation({
  args: {
    id: v.id("subscriptions"),
  },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx)
    const doc = await ctx.db.get(id)
    if (!doc || doc.userId !== userId) {
      throw new Error("サブスクリプションが見つかりません")
    }
    await ctx.db.delete(id)
  },
})

export const seedDemoIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx)
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(1)
    if (existing.length > 0) {
      return { seeded: false as const }
    }
    for (const row of DEMO_ROWS) {
      await ctx.db.insert("subscriptions", { userId, ...row })
    }
    return { seeded: true as const }
  },
})
