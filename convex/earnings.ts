import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// N/B: Every wifi has one isUpcoming earning

export const createEarning = mutation({
  args: {
    owner: v.id("users"),
    wifi: v.id("wifis"),
    amountEarned: v.number(),
    weekEnding: v.string(),
    isUpcoming: v.boolean(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { amountEarned, isUpcoming, owner, weekEnding, wifi } = args;
    const existingEarning = await db
      .query("earnings")
      .filter((q) => q.eq(q.field("weekEnding"), weekEnding))
      .first();
    if (existingEarning) return;

    const newEarningId = await db.insert("earnings", {
      amountEarned,
      isUpcoming,
      owner,
      weekEnding,
      wifi,
    });

    return newEarningId;
  },
});

export const getOwnersUpcomingEarnings = query({
  args: {
    owner: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { owner } = args;
    if (!owner) return undefined;

    const earnings = await db
      .query("earnings")
      .withIndex("by_owner_wifi", (q) => q.eq("owner", owner))
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .collect();

    const output = await Promise.all(
      earnings.map(async (earning) => {
        const wifi = await db.get(earning.wifi);
        const owner = await db.get(earning.owner);
        return { ...earning, wifi, owner };
      })
    );

    return output;
  },
});

export const getOwnersPastEarnings = query({
  args: {
    owner: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { owner } = args;
    if (!owner) return undefined;

    const earnings = await db
      .query("earnings")
      .withIndex("by_owner_wifi", (q) => q.eq("owner", owner))
      .filter((q) => q.eq(q.field("isUpcoming"), false))
      .collect();

    const output = await Promise.all(
      earnings.map(async (earning) => {
        const wifi = await db.get(earning.wifi);
        const owner = await db.get(earning.owner);
        return { ...earning, wifi, owner };
      })
    );

    return output;
  },
});

export const getAllOwnersEarnings = query({
  args: {
    owner: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { owner } = args;
    if (!owner) return undefined;

    const earnings = await db
      .query("earnings")
      .withIndex("by_owner_wifi", (q) => q.eq("owner", owner))
      .collect();

    const output = await Promise.all(
      earnings.map(async (earning) => {
        const wifi = await db.get(earning.wifi);
        const owner = await db.get(earning.owner);
        return { ...earning, wifi, owner };
      })
    );

    return output;
  },
});

export const getAllEarningsAdmin = query({
  args: {
    adminEmail: v.optional(v.string()),
    isUpcoming: v.boolean(),
  },
  handler: async ({ db }, args) => {
    const { adminEmail, isUpcoming } = args;
    if (!adminEmail) return null;
    const isAdmin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), adminEmail))
      .first();
    if (!isAdmin) return null;

    const earnings = await db
      .query("earnings")
      .filter((q) => q.eq(q.field("isUpcoming"), isUpcoming))
      .collect();

    const output = await Promise.all(
      earnings.map(async (earning) => {
        const wifi = await db.get(earning.wifi);
        const owner = await db.get(earning.owner);
        return { ...earning, wifi, owner };
      })
    );

    return output;
  },
});

// pay the user (update isUpcoming:false; create a new earning; and deposit to user balance)
export const payEarning = mutation({
  args: {
    earningId: v.id("earnings"),
    nextWeekEnding: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    // get earning
    const earning = await db.get(args.earningId);
    if (!earning) throw new ConvexError("No earning was found");

    // get owner
    const owner = await db.get(earning.owner);
    if (!owner) throw new ConvexError("No owner was found");

    // make the payment
    await db.patch(earning._id, {
      isUpcoming: false,
    });
    await db.patch(owner._id, {
      balance: owner.balance + earning.amountEarned,
    });
    await db.insert("earnings", {
      owner: owner._id,
      wifi: earning.wifi,
      amountEarned: 0,
      weekEnding: args.nextWeekEnding,
      isUpcoming: true,
    });
  },
});

/**
 * Deposit to owner's balance,
 * set isUpcoming:false,
 * create new upcoming earning for the wifiNetwork
 * */
export const makePayment = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    weekEnding: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    // check if is admin
    const { adminEmail } = args;
    if (!adminEmail) return null;
    const isAdmin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), adminEmail))
      .first();
    if (!isAdmin)
      throw new ConvexError(
        "You dont have sufficent authority to perform the action."
      );

    // get all upcoming earnings
    const earnings = await db
      .query("earnings")
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .collect();

    // process eact earning
    for (const earning of earnings) {
      // change isUpcoming:false
      await db.patch(earning._id, {
        isUpcoming: false,
      });

      // create a new earning for the wifi network
      await db.insert("earnings", {
        wifi: earning.wifi,
        owner: earning.owner,
        amountEarned: 0,
        isUpcoming: true,
        weekEnding: args.weekEnding,
      });

      // deposit amount to owner
      const owner = await db.get(earning.owner);
      if (owner) {
        await db.patch(earning.owner, {
          balance: owner.balance + earning.amountEarned,
        });
      }
    }
  },
});

// get user earnings and deposit to their balance
export const processEarnings = internalMutation({
  handler: async ({ db }) => {
    // helper function (the next  monday from now)
    const getNextPaymentDate = (date: Date): Date => {
      const result = new Date(date);
      // calculate how many days to add to get to the next monday
      const dayOfWeek = result.getDay();
      const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;
      // set the date to the next monday 00:00:00
      result.setDate(result.getDate() + daysUntilMonday);
      result.setHours(0, 0, 0, 0);
      return result;
    };

    // get all upcoming earnings
    const earnings = await db
      .query("earnings")
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .collect();

    for (const earning of earnings) {
      // change upcoming to false
      await db.patch(earning._id, {
        isUpcoming: false,
      });

      // then create a new earning (where isUpcoming: true)
      const now = new Date();
      const weekEnding = `${getNextPaymentDate(now)}`;
      await db.insert("earnings", {
        amountEarned: 0,
        isUpcoming: true,
        weekEnding,
        owner: earning.owner,
        wifi: earning.wifi,
      });

      // deposit to user's (owner) balance
      const user = await db.get(earning.owner);
      if (!user) continue;
      await db.patch(user._id, {
        balance: user.balance + earning.amountEarned,
      });
    }
  },
});
