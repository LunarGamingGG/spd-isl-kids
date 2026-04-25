import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("gallery"),
    _creationTime: v.number(),
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
    description: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("gallery").order("desc").collect();
  },
});
