import type { Doc } from "@/convex/_generated/dataModel"
import type { Subscription } from "@/types/subscription"

export function docToSubscription(doc: Doc<"subscriptions">): Subscription {
  return {
    id: doc._id,
    name: doc.name,
    categoryId: doc.categoryId,
    billingInterval: doc.billingInterval,
    amountJpy: doc.amountJpy,
    standardAmountJpy: doc.standardAmountJpy,
    billingDayOfMonth: doc.billingDayOfMonth,
    billingMonth: doc.billingMonth,
    siteUrl: doc.siteUrl,
    status: doc.status,
  }
}
