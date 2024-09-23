import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWidthrawalTransaction = mutation({
  args: {
    user: v.id("users"),
    amount: v.string(),
    currency: v.string(),
    description: v.string(),
    payment_account: v.string(), // mpesa phone number to be paid to
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
      currency,
      description,
      payment_account,
      payment_method,
      payment_status_description,
      user,
    } = args;

    // check if user has juice
    const userData = await db.get(user);
    const hasJuice = userData && userData.balance > +amount;
    if (!userData || !hasJuice)
      throw new ConvexError(
        `You have insufficient balance to widthraw KSH${amount}`
      );

    // credit the user's balance
    const balance = userData.balance - +amount;
    await db.patch(user, {
      balance,
    });

    const newTransactionId = await db.insert("widthrawaltransactions", {
      amount,
      currency,
      description,
      payment_account,
      payment_method,
      payment_status_description,
      user,
    });

    return newTransactionId;
  },
});

export const updateWidthrawalTransaction = mutation({
  args: {
    id: v.id("widthrawaltransactions"),
    payment_status_description: v.union(
      v.literal("Invalid"),
      v.literal("Completed"),
      v.literal("Failed"),
      v.literal("Reversed"),
      v.literal("Pending")
    ),
  },
  handler: async ({ db, auth }, args) => {
    const { id, payment_status_description } = args;

    const existingTransaction = await db.get(id);
    if (!existingTransaction) throw new ConvexError("Transaction not found!");

    await db.patch(id, {
      payment_status_description,
    });
  },
});

export const getUserWidthrawalTransactionHistory = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { userId } = args;
    if (!userId) return undefined;

    const transactions = await db
      .query("widthrawaltransactions")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .order("desc")
      .collect();

    return transactions;
  },
});

export const getAllWidthrawalTransactionRequests = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { userId } = args;
    if (!userId) return undefined;

    // check if user is admin
    const user = await db.get(userId);
    const admin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), user?.email))
      .first();

    if (!admin) return undefined;

    const transactions = await db
      .query("widthrawaltransactions")
      .order("desc")
      .collect();
    const output = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await db.get(transaction.user);
        return { ...transaction, user };
      })
    );

    return output;
  },
});
