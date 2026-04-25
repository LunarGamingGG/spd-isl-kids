import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateMatch = mutation({
  args: {
    id: v.id("matches"),
    homeScore: v.number(),
    awayScore: v.number(),
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("completed")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      homeScore: args.homeScore,
      awayScore: args.awayScore,
      status: args.status,
    });
    return null;
  },
});

export const updatePlayerStats = mutation({
  args: {
    id: v.id("players"),
    field: v.union(v.literal("goals"), v.literal("assists"), v.literal("yellowCards"), v.literal("redCards")),
    value: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { [args.field]: args.value });
    return null;
  },
});

export const addRule = mutation({
  args: { content: v.string(), order: v.number() },
  returns: v.id("rules"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("rules", { content: args.content, order: args.order });
  },
});

export const addGalleryItem = mutation({
  args: {
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
    description: v.optional(v.string()),
  },
  returns: v.id("gallery"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("gallery", args);
  },
});

export const deleteRule = mutation({
  args: { id: v.id("rules") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
