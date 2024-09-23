import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAdmin = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async ({ db }, args) => {
    const user = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new ConvexError(`No user with email ${args.email} found.`);

    const admin = await db
      .query("admins")
      .filter((q) => q.eq(q.field("email"), args.email))
      .filter((q) => q.eq(q.field("password"), args.password))
      .first();

    return admin;
  },
});

export const getAdmins = query({
  handler: async ({ db }) => {
    const admins = await db.query("admins").order("asc").collect();

    return admins;
  },
});
