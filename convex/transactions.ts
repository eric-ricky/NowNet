import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTransaction = mutation({
  args: {
    user: v.id("users"),
    amount: v.number(),
    transanctionCost: v.optional(v.number()),
    phoneNumber: v.string(),
    type: v.union(v.literal("DEPOSIT"), v.literal("WITHDRAWAL")),
    status: v.union(v.literal("PENDING"), v.literal("COMPLETED")),
    reference: v.string(),
    timeStamp: v.string(),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const userData = await db.get(args.user);
    if (!userData) throw new ConvexError("User not found!");

    const {
      amount,
      reference,
      status,
      timeStamp,
      type,
      user,
      phoneNumber,
      transanctionCost,
    } = args;

    const newTransactionId = await db.insert("transactions", {
      amount,
      reference,
      status,
      timeStamp,
      type,
      user,
      phoneNumber,
      transanctionCost,
    });

    // update user earnings
    if (type === "WITHDRAWAL") {
      const tc = transanctionCost || 0;
      const earnings = userData.earnings || 0;
      await db.patch(user, { earnings: earnings - (amount + tc) });
    }

    return newTransactionId;
  },
});

export const deleteTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async ({ db }, args) => {
    const { id } = args;

    const existingTransaction = await db.get(id);
    if (!existingTransaction) throw new ConvexError("Transaction not found!");

    await db.delete(id);
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    user: v.id("users"),
    amount: v.number(),
    transanctionCost: v.optional(v.number()),
    type: v.union(v.literal("DEPOSIT"), v.literal("WITHDRAWAL")),
    status: v.union(v.literal("PENDING"), v.literal("COMPLETED")),
    timeStamp: v.string(),
    reference: v.string(),
  },
  handler: async ({ db }, args) => {
    const {
      id,
      amount,
      transanctionCost,
      reference,
      status,
      timeStamp,
      type,
      user,
    } = args;

    const existingTransaction = await db.get(id);
    if (!existingTransaction) throw new ConvexError("Transaction not found!");

    await db.patch(id, {
      amount,
      transanctionCost,
      reference,
      status,
      timeStamp,
      type,
      user,
    });
  },
});

export const getTransactionByReference = query({
  args: {
    reference: v.string(),
  },
  handler: async ({ db }, args) => {
    const transaction = await db
      .query("transactions")
      .filter((q) => q.eq(q.field("reference"), args.reference))
      .unique();

    if (!transaction) return;

    const user = await db.get(transaction.user);

    return { ...transaction, user };
  },
});

export const getUserTransactionHistory = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { userId } = args;
    if (!userId) return undefined;

    const transactions = await db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .order("desc")
      .collect();

    return transactions;
  },
});

export const getWidthrawalTransactions = query({
  args: {
    adminEmail: v.string(),
  },
  handler: async ({ db }, args) => {
    const { adminEmail } = args;

    const isAdmin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), adminEmail))
      .unique();
    if (!isAdmin) return;

    const transactions = await db
      .query("transactions")
      .filter((q) => q.eq(q.field("type"), "WITHDRAWAL"))
      .order("asc")
      .collect();

    const output = await Promise.all(
      transactions.map(async (transaction) => ({
        ...transaction,
        user: await db.get(transaction.user),
      }))
    );

    return output;
  },
});
