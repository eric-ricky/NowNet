import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTopupTransaction = mutation({
  args: {
    user: v.id("users"),
    amount: v.string(),
    confirmation_code: v.string(),
    created_date: v.string(),
    currency: v.string(),
    description: v.string(),
    order_tracking_id: v.string(),
    payment_account: v.string(),
    payment_method: v.string(),
    payment_status_description: v.union(
      v.literal("Invalid"),
      v.literal("Completed"),
      v.literal("Failed"),
      v.literal("Reversed"),
      v.literal("Pending")
    ),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const {
      amount,
      confirmation_code,
      created_date,
      currency,
      description,
      order_tracking_id,
      payment_account,
      payment_method,
      payment_status_description,
      user,
    } = args;

    const newTransactionId = await db.insert("topuptransactions", {
      user,
      amount,
      confirmation_code,
      created_date,
      currency,
      description,
      order_tracking_id,
      payment_account,
      payment_method,
      payment_status_description,
    });

    return newTransactionId;
  },
});

export const deleteTopupTransaction = mutation({
  args: {
    id: v.id("topuptransactions"),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { id } = args;

    const existingTransaction = await db.get(id);
    if (!existingTransaction) throw new ConvexError("Transaction not found!");

    await db.delete(id);
  },
});

export const updateTopupTransaction = mutation({
  args: {
    id: v.id("topuptransactions"),
    amount: v.string(),
    confirmation_code: v.string(),
    created_date: v.string(),
    currency: v.string(),
    description: v.string(),
    order_tracking_id: v.string(),
    payment_account: v.string(),
    payment_method: v.string(),
    payment_status_description: v.union(
      v.literal("Invalid"),
      v.literal("Completed"),
      v.literal("Failed"),
      v.literal("Reversed"),
      v.literal("Pending")
    ),
  },
  handler: async ({ db, auth }, args) => {
    const {
      id,
      amount,
      confirmation_code,
      created_date,
      currency,
      description,
      order_tracking_id,
      payment_account,
      payment_method,
      payment_status_description,
    } = args;

    const existingTransaction = await db.get(id);
    if (!existingTransaction) throw new ConvexError("Transaction not found!");

    await db.patch(id, {
      amount,
      confirmation_code,
      created_date,
      currency,
      description,
      order_tracking_id,
      payment_account,
      payment_method,
      payment_status_description,
    });
  },
});

export const getTopupTransaction = query({
  args: {
    id: v.id("topuptransactions"),
  },
  handler: async ({ db }, args) => {
    const transaction = await db.get(args.id);
    if (!transaction) return;

    const user = await db.get(transaction.user);

    return { ...transaction, user };
  },
});

export const getUserTopupTransactionHistory = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { userId } = args;
    if (!userId) return undefined;

    const transactions = await db
      .query("topuptransactions")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .order("desc")
      .collect();

    return transactions;
  },
});
