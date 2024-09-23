import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    uid: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    balance: v.number(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { balance, email, name, uid, avatarUrl, phone } = args;
    const existingUser = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existingUser) throw new ConvexError("User already exists");

    const newUserId = await db.insert("users", {
      balance,
      email,
      name,
      uid,
      avatarUrl,
      phone,
    });

    return newUserId;
  },
});

export const getUser = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    const { email } = args;
    if (!email) return null;

    const user = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    return user;
  },
});

export const getUserById = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    if (!args.userId) return null;

    const normalizedUserId = db.normalizeId("users", args.userId);
    if (!normalizedUserId) return null;

    const user = await db.get(normalizedUserId);

    return user;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    balance: v.optional(v.number()),
  },
  handler: async ({ db }, args) => {
    // get all users
    const user = await db.get(args.id);
    if (!user) return;

    const { balance, name, avatarUrl, phone } = args;
    await db.patch(args.id, {
      balance: balance || user.balance,
      name: name || user.name,
      avatarUrl: avatarUrl || user.avatarUrl,
      phone: phone || user.phone,
    });
  },
});

export const checkIfUserHasJuice = internalMutation({
  handler: async ({ db }) => {
    // get all users
    const users = await db.query("users").collect();

    // for every user get all their 'connected' subscriptions
    const subscriptions = await Promise.all(
      users.map(async (user) => {
        const tempSubscriptions = await db
          .query("subscriptions")
          .withIndex("by_user", (q) => q.eq("user", user._id))
          .filter((q) => q.eq(q.field("status"), "connected"))
          .collect();
        const userSubscriptions = await Promise.all(
          tempSubscriptions.map(async (tempSub) => {
            const wifi = await db.get(tempSub.wifi);
            return { ...tempSub, wifi };
          })
        );

        return { user: user, userSubscriptions };
      })
    );

    for (const userSubscription of subscriptions) {
      const currentUserBalance = userSubscription.user.balance;

      // get new consumed from 'lastCredited'
      const newAmountsConsumed = userSubscription.userSubscriptions.map(
        (sub) => {
          // get time consumed
          const startTime = new Date(sub.lastCredited);
          const now = new Date();
          const timeTakenInHours =
            (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

          // get the amount consumed
          const newAmountConsumed = sub.wifi?.rate
            ? timeTakenInHours * (+sub.wifi.rate / (30 * 24))
            : 0;

          return newAmountConsumed;
        }
      );
      const newAmountConsumed = newAmountsConsumed.reduce(
        (total, current) => total + current,
        0
      );
      const newUserBalance = currentUserBalance - newAmountConsumed;

      // if new balance is negative
      if (newUserBalance < 0) {
        // disconnect all subs
        for (const sub of userSubscription.userSubscriptions) {
          await db.patch(sub._id, {
            status: "disconnected",
            endTime: `${new Date()}`,
          });
        }
      }
    }
  },
});
