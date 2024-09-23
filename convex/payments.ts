import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createPayments = mutation({
  args: {
    user: v.id("users"),
    amount: v.number(),
    date: v.string(),
    reason: v.union(v.literal("buy_token"), v.literal("widthrawal")),
    note: v.optional(v.string()),
    transanctionReference: v.string(),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { user, amount, date, reason, note, transanctionReference } = args;

    const newPayment = await db.insert("payments", {
      user,
      amount,
      date,
      reason,
      note,
      transanctionReference,
    });

    if (reason === "buy_token") {
      const savedUser = await db.get(user);
      if (!savedUser) throw new ConvexError("User not found");

      await db.patch(user, {
        balance: savedUser.balance + amount,
      });
    }

    return newPayment;
  },
});
