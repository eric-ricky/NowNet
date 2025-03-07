// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      uid: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
      phone: v.optional(v.string()),
      balance: v.number(),
      earnings: v.number(),
      notificationSubscription: v.optional(v.string()),
    }).index("by_email", ["email"]),
    wifis: defineTable({
      name: v.string(), // should be unique
      rate: v.number(),
      speed: v.string(), // Mbps
      owner: v.id("users"),
    })
      .searchIndex("search_name", {
        searchField: "name",
      })
      .index("by_name", ["name"])
      .index("by_owner", ["owner"]),
    devices: defineTable({
      user: v.id("users"),
      name: v.string(),
      macAddress: v.string(),
    }),
    subscriptions: defineTable({
      wifi: v.id("wifis"),
      user: v.id("users"),
      device: v.id("devices"),
      startTime: v.string(),
      endTime: v.optional(v.string()), // undefined if still active
      lastCredited: v.string(), // last time the amountConsumed was updated
      amountConsumed: v.number(),
      isActive: v.boolean(),
      status: v.union(
        v.literal("pending"),
        v.literal("connected"),
        v.literal("disconnected")
      ),
    })
      .index("by_user", ["user"])
      .index("by_wifi", ["wifi"]),
    payments: defineTable({
      user: v.id("users"),
      amount: v.number(),
      date: v.string(),
      reason: v.union(v.literal("buy_token"), v.literal("widthrawal")),
      note: v.optional(v.string()),
      transanctionReference: v.string(),
    }),
    transactions: defineTable({
      user: v.id("users"),
      amount: v.number(),
      transanctionCost: v.optional(v.number()),
      phoneNumber: v.string(),
      type: v.union(v.literal("DEPOSIT"), v.literal("WITHDRAWAL")),
      status: v.union(v.literal("PENDING"), v.literal("COMPLETED")),
      reference: v.string(),
      timeStamp: v.string(),
      // confirmation_code: v.string(),
      // created_date: v.string(),
      // currency: v.string(),
      // description: v.string(),
      // order_tracking_id: v.string(),
      // payment_account: v.string(),
      // payment_method: v.string(),
      // payment_status_description: v.union(
      //   v.literal("Invalid"),
      //   v.literal("Completed"),
      //   v.literal("Failed"),
      //   v.literal("Reversed"),
      //   v.literal("Pending")
      // ),
    }).index("by_user", ["user"]),
    earnings: defineTable({
      owner: v.id("users"),
      wifi: v.id("wifis"),
      totalEarnings: v.number(),
      commission: v.number(),
      ownerEarnings: v.number(),
      weekEnding: v.string(),
      isUpcoming: v.boolean(),
      isArchived: v.boolean(),
    }).index("by_owner_wifi", ["owner", "wifi"]),
    admins: defineTable({
      email: v.string(),
      password: v.string(),
    }),
  },
  { schemaValidation: true }
);
