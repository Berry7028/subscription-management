import type { Subscription } from "@/types/subscription"

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    amountJpy: 1490,
    billingDayOfMonth: 5,
    siteUrl: "https://www.netflix.com",
    status: "active",
  },
  {
    id: "2",
    name: "Spotify",
    amountJpy: 980,
    billingDayOfMonth: 12,
    siteUrl: "https://www.spotify.com",
    status: "active",
  },
  {
    id: "3",
    name: "GitHub",
    amountJpy: 550,
    billingDayOfMonth: 28,
    siteUrl: "https://github.com",
    status: "active",
  },
  {
    id: "4",
    name: "Adobe CC",
    amountJpy: 6780,
    billingDayOfMonth: 15,
    siteUrl: "https://www.adobe.com",
    status: "archived",
  },
  {
    id: "5",
    name: "Dropbox",
    amountJpy: 1200,
    billingDayOfMonth: 1,
    siteUrl: "https://www.dropbox.com",
    status: "archived",
  },
]
