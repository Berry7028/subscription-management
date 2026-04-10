import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const subscriptionCategoryId = v.union(
  v.literal("streaming"),
  v.literal("music"),
  v.literal("dev"),
  v.literal("cloud"),
  v.literal("productivity"),
  v.literal("other")
)

const billingInterval = v.union(
  v.literal("monthly"),
  v.literal("quarterly"),
  v.literal("yearly")
)

const subscriptionStatus = v.union(v.literal("active"), v.literal("archived"))

export default defineSchema({
  ...authTables,
  subscriptions: defineTable({
    userId: v.id("users"),
    name: v.string(),
    categoryId: subscriptionCategoryId,
    billingInterval,
    amountJpy: v.number(),
    standardAmountJpy: v.optional(v.number()),
    billingDayOfMonth: v.number(),
    billingMonth: v.number(),
    siteUrl: v.string(),
    status: subscriptionStatus,
  }).index("by_user", ["userId"]),
})
