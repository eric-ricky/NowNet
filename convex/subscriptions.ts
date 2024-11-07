import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createSubscription = mutation({
  args: {
    wifi: v.id("wifis"),
    user: v.id("users"),
    device: v.id("devices"),
    startTime: v.string(),
    endTime: v.optional(v.string()), // undefined if still active
    lastCredited: v.string(),
    amountConsumed: v.number(),
    isActive: v.boolean(),
    status: v.union(
      v.literal("pending"),
      v.literal("connected"),
      v.literal("disconnected")
    ),

    notification_charge: v.number(),
    isNew: v.optional(v.boolean()),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");
    const {
      user,
      wifi,
      device,
      startTime,
      endTime,
      lastCredited,
      amountConsumed,
      isActive,
      status,

      notification_charge,
      isNew,
    } = args;

    // === check if user has juice 😂😀
    const userData = await db.get(user);
    if (!userData) throw new ConvexError("No user was found");
    const userSubscriptions = await db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user", user))
      .filter((q) => q.eq(q.field("status"), "connected"))
      .collect();
    const totalConsumed = userSubscriptions.reduce(
      (total, curr) => total + curr.amountConsumed,
      0
    );
    const userCurrentBalance =
      userData.balance - totalConsumed - notification_charge;
    if (userCurrentBalance < 1) {
      throw new ConvexError(
        `💸 Insufficient balance. Please top up your account to continue`
      );
    }

    // === check if is an active connection (with the same device & wifi)
    let existingActiveSubscription = await db
      .query("subscriptions")
      .withIndex("by_wifi", (q) => q.eq("wifi", wifi))
      .filter((q) =>
        q.and(
          q.eq(q.field("device"), device),
          q.eq(q.field("isActive"), true),
          q.eq(q.field("status"), "connected")
        )
      )
      .first();

    // 💡 if isNew is true, then it's a new subscription, so we don't need to check for status 'connected'
    if (isNew) {
      existingActiveSubscription = await db
        .query("subscriptions")
        .withIndex("by_wifi", (q) => q.eq("wifi", wifi))
        .filter((q) =>
          q.and(
            q.eq(q.field("device"), device),
            q.eq(q.field("isActive"), true)
          )
        )
        .first();
    }

    if (existingActiveSubscription) {
      const wifiData = await db.get(wifi);
      const deviceData = await db.get(device);
      throw new ConvexError(
        `An active subscription between ${deviceData?.name} and ${wifiData?.name} already exists!`
      );
    }

    // === create subscription
    const newSubscriptionId = await db.insert("subscriptions", {
      user,
      wifi,
      device,
      startTime,
      lastCredited,
      endTime,
      amountConsumed,
      isActive,
      status,
    });

    // charge user for notification
    await db.patch(user, { balance: userCurrentBalance });

    return newSubscriptionId;
  },
});

export const markSubscriptionAsConnected = mutation({
  args: {
    id: v.id("subscriptions"),
    startTime: v.optional(v.string()),
    status: v.literal("connected"),

    notification_charge: v.number(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const {
      id: subscriptionId,
      status,
      startTime,

      notification_charge,
    } = args;

    const existingSubscription = await db.get(subscriptionId);
    if (!existingSubscription) throw new ConvexError("Subscription not found");

    // === check if user has juice 😂😀
    const userData = await db.get(existingSubscription.user);
    if (!userData) throw new ConvexError("No user was found");
    const userSubscriptions = await db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user", existingSubscription.user))
      .filter((q) => q.eq(q.field("status"), "connected"))
      .collect();
    const totalConsumed = userSubscriptions.reduce(
      (total, curr) => total + curr.amountConsumed,
      0
    );
    const userCurrentBalance =
      userData.balance - totalConsumed - notification_charge;
    if (userCurrentBalance < 1) {
      throw new ConvexError(`💸 User has insufficient balance.`);
    }

    // update status
    await db.patch(subscriptionId, {
      status: status || existingSubscription.status,
      startTime: startTime || existingSubscription.startTime,
    });

    // charge user for notification
    await db.patch(existingSubscription.user, { balance: userCurrentBalance });
  },
});

export const updateSubscription = mutation({
  args: {
    id: v.id("subscriptions"),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    amountConsumed: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("connected"),
        v.literal("disconnected")
      )
    ),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const {
      id: subscriptionId,
      status,
      startTime,
      amountConsumed,
      isActive,
      endTime,
    } = args;

    const existingSubscription = await db.get(subscriptionId);
    if (!existingSubscription) throw new ConvexError("Subscription not found");

    await db.patch(subscriptionId, {
      status: status || existingSubscription.status,
      startTime: startTime || existingSubscription.startTime,
      amountConsumed: amountConsumed || existingSubscription.amountConsumed,
      isActive:
        isActive === undefined ? existingSubscription.isActive : isActive,
      endTime: endTime || existingSubscription.endTime,
    });
  },
});

export const getUsersSubscriptions = query({
  args: {
    user: v.optional(v.id("users")),
    inActive: v.optional(v.boolean()),
  },
  handler: async ({ db }, args) => {
    const { user, inActive } = args;
    if (!user) return undefined;

    if (inActive) {
      const subscriptions = await db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("user", user))
        .filter((q) => q.eq(q.field("isActive"), false))
        .collect();

      const output = await Promise.all(
        subscriptions.map(async (sub) => {
          const user = await db.get(sub.user);
          const wifi = await db.get(sub.wifi);
          const device = await db.get(sub.device);

          return { ...sub, user, wifi, device };
        })
      );

      return output;
    }

    const subscriptions = await db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user", user))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const output = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await db.get(sub.user);
        const wifi = await db.get(sub.wifi);
        const device = await db.get(sub.device);

        return { ...sub, user, wifi, device };
      })
    );

    return output;
  },
});

export const getTotalSpentByUser = query({
  args: {
    user: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { user } = args;
    if (!user) return undefined;

    const subscriptions = await db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("user", user))
      // .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const totalSpent = subscriptions.reduce(
      (total, curr) => total + curr.amountConsumed,
      0
    );

    return totalSpent;
  },
});

export const getWifisSubscriptions = query({
  args: {
    wifi: v.optional(v.id("wifis")),
  },
  handler: async ({ db }, args) => {
    const { wifi } = args;
    if (!wifi) return [];

    const subscriptions = await db
      .query("subscriptions")
      .withIndex("by_wifi", (q) => q.eq("wifi", wifi))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const output = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await db.get(sub.user);
        const wifi = await db.get(sub.wifi);
        const device = await db.get(sub.device);

        return { ...sub, user, wifi, device };
      })
    );

    return output;
  },
});

export const updateConsumedAmount = internalMutation({
  handler: async ({ db }) => {
    const subscriptions = await db
      .query("subscriptions")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("status"), "connected")
        )
      )
      .collect();

    const output = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await db.get(sub.user);
        const wifi = await db.get(sub.wifi);
        const device = await db.get(sub.device);

        return { ...sub, user, wifi, device };
      })
    );

    for (const sub of output) {
      const { user, wifi } = sub;
      if (!user || !wifi) continue;

      // get time consumed
      const startTime = new Date(sub.lastCredited);
      const nowUTC = new Date();

      const timeTakenInHours =
        (nowUTC.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      // get the amount consumed i.e. 720 = 30*24 hrs
      const newAmountConsumed = sub.wifi?.rate
        ? timeTakenInHours * (+sub.wifi.rate / 720)
        : 0;
      const newCommission = 0.1 * newAmountConsumed;
      const newOwnerEarnings = newAmountConsumed - newCommission;

      // update amount consumed
      await db.patch(sub._id, {
        amountConsumed: sub.amountConsumed + newAmountConsumed,
        lastCredited: `${nowUTC}`,
      });

      // update new balance
      await db.patch(user._id, {
        balance: user.balance - newAmountConsumed,
      });

      // update currently upcoming earning
      const owner = wifi.owner;
      const wifiId = wifi._id;
      const upcomingEarning = await db
        .query("earnings")
        .withIndex("by_owner_wifi", (q) =>
          q.eq("owner", owner).eq("wifi", wifiId)
        )
        .filter((q) => q.eq(q.field("isUpcoming"), true))
        .first();

      if (!upcomingEarning) continue;

      await db.patch(upcomingEarning._id, {
        totalEarnings: upcomingEarning.totalEarnings + newAmountConsumed,
        commission: upcomingEarning.commission + newCommission,
        ownerEarnings: upcomingEarning.ownerEarnings + newOwnerEarnings,
      });
    }
  },
});

// for admin
export const getAllActiveSubscriptionsAdmin = query({
  args: {
    adminEmail: v.optional(v.string()),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { adminEmail } = args;
    const admin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), adminEmail))
      .first();
    if (!admin) return undefined;

    const subscriptions = await db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const output = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await db.get(sub.user);
        const wifi = await db.get(sub.wifi);

        return { ...sub, wifi, user };
      })
    );

    return output;
  },
});
