import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDevice = mutation({
  args: {
    user: v.id("users"),
    name: v.string(),
    macAddress: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { name, macAddress, user } = args;
    const existingDevice = await db
      .query("devices")
      .filter((q) => q.eq(q.field("user"), args.user))
      .filter((q) => q.eq(q.field("macAddress"), macAddress))
      .first();

    if (existingDevice)
      throw new ConvexError(
        `Device with mac address ${macAddress} already exists`
      );

    const newDeviceId = await db.insert("devices", {
      name,
      macAddress,
      user,
    });

    return newDeviceId;
  },
});

export const getUsersDevices = query({
  args: {
    user: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { user } = args;
    if (!args) return undefined;

    const devices = await db
      .query("devices")
      .filter((q) => q.eq(q.field("user"), user))
      .collect();

    return devices;
  },
});

export const deleteDevice = mutation({
  args: {
    id: v.id("devices"),
  },
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    await db.delete(args.id);
  },
});

export const updateDevice = mutation({
  args: {
    id: v.id("devices"),
    user: v.id("users"),
    name: v.string(),
    macAddress: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");

    const { id: deviceId, macAddress, name, user } = args;

    const existingDevice = await db.get(deviceId);
    if (!existingDevice) throw new ConvexError("Device not found");

    await db.patch(deviceId, {
      name,
      macAddress,
      user,
    });
  },
});
