import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWifi = mutation({
  args: {
    name: v.string(), // should be unique
    rate: v.string(),
    location: v.optional(v.string()),
    owner: v.id("users"),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { name, owner, rate, location } = args;
    const existingWifi = await db
      .query("wifis")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();
    if (existingWifi)
      throw new ConvexError(`Wifi with name ${name} already exists`);

    const newWifiId = await db.insert("wifis", {
      name,
      owner,
      rate,
      location,
    });

    return newWifiId;
  },
});

export const getWifiById = query({
  args: {
    wifiId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { userId, wifiId } = args;
    if (!wifiId || !userId) return null;

    const normalizedWifiId = db.normalizeId("wifis", wifiId);
    if (!normalizedWifiId) return null;

    const wifi = await db.get(normalizedWifiId);

    // check if is owner of that wifi
    const user = await db.get(userId);
    if (user?._id === wifi?.owner) return wifi;

    // or if user is admin
    const admin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), user?.email))
      .first();
    if (admin?._id) return wifi;

    return null;
  },
});

export const getOwnersWifis = query({
  args: {
    owner: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { owner } = args;

    const wifis = await db
      .query("wifis")
      .filter((q) => q.eq(q.field("owner"), owner))
      .collect();

    const output = await Promise.all(
      wifis.map(async (wifi) => {
        const owner = await db.get(wifi.owner);
        return { ...wifi, owner };
      })
    );

    return output;
  },
});

export const getAdminWifis = query({
  args: {
    adminEmail: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    const { adminEmail } = args;
    if (!adminEmail) return [];

    const admin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), adminEmail))
      .first();
    if (!admin) return [];

    const wifis = await db.query("wifis").collect();
    const output = await Promise.all(
      wifis.map(async (wifi) => {
        const owner = await db.get(wifi.owner);
        return { ...wifi, owner };
      })
    );

    return output;
  },
});

export const deleteWifi = mutation({
  args: {
    id: v.id("wifis"),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    // check subscriptions
    const subscription = await db
      .query("subscriptions")
      .withIndex("by_wifi", (q) => q.eq("wifi", args.id))
      .first();
    if (subscription)
      throw new ConvexError("Cannot delete network with subscriptions");

    await db.delete(args.id);
  },
});

export const updateWifi = mutation({
  args: {
    id: v.id("wifis"),
    name: v.string(), // should be unique
    rate: v.string(),
    location: v.optional(v.string()),
    owner: v.id("users"),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { id: wifiId, name, owner, rate, location } = args;

    const existingWifi = await db.get(wifiId);
    if (!existingWifi) throw new ConvexError("Device not found");

    await db.patch(wifiId, {
      name,
      location,
      owner,
      rate,
    });
  },
});

export const getWifiByName = query({
  args: {
    name: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const wifis = await db
      .query("wifis")
      .withSearchIndex("search_name", (q) => q.search("name", args.name))
      .take(5);

    const output = await Promise.all(
      wifis.map(async (wifi) => {
        const owner = await db.get(wifi.owner);
        return { ...wifi, owner };
      })
    );

    return output;
  },
});
