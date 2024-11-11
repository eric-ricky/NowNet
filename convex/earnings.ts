import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// N/B: Every wifi has one isUpcoming earning

export const createEarning = mutation({
  args: {
    owner: v.id("users"),
    wifi: v.id("wifis"),
    totalEarnings: v.number(),
    commission: v.number(),
    ownerEarnings: v.number(),
    weekEnding: v.string(),
    isUpcoming: v.boolean(),
    isArchived: v.boolean(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const {
      wifi,
      owner,
      totalEarnings,
      commission,
      ownerEarnings,
      isArchived,
      isUpcoming,
      weekEnding,
    } = args;
    const existingUpcomingEarning = await db
      .query("earnings")
      .withIndex("by_owner_wifi", (q) => q.eq("owner", owner).eq("wifi", wifi))
      .filter((q) => q.eq(q.field("isUpcoming"), true))
      .first();
    if (existingUpcomingEarning) return;

    const newEarningId = await db.insert("earnings", {
      wifi,
      owner,
      totalEarnings,
      commission,
      ownerEarnings,
      isArchived,
      isUpcoming,
      weekEnding,
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
      .order("desc")
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

/** Pay the user
 * (update isUpcoming:false;
 * create a new earning;
 * and deposit to user.earnings)
 */
export const payEarning = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    earningId: v.id("earnings"),
    nextWeekEnding: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    // check if is admin
    const isAdmin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), args.adminEmail))
      .first();
    if (!isAdmin)
      throw new ConvexError("You are not authorized to perform the action");

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
      earnings: owner.earnings + earning.ownerEarnings,
    });
    await db.insert("earnings", {
      wifi: earning.wifi,
      owner: earning.owner,
      totalEarnings: 0,
      commission: 0,
      ownerEarnings: 0,
      isArchived: false,
      isUpcoming: true,
      weekEnding: args.nextWeekEnding,
    });
  },
});
