import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTopScorers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("players"),
    name: v.string(),
    goals: v.number(),
    teamName: v.string(),
    teamShort: v.string(),
  })),
  handler: async (ctx) => {
    const players = await ctx.db
      .query("players")
      .order("desc") // This isn't efficient if there's no index on goals, but it's a small dataset. 
      // Actually Convex doesn't allow order without index if not _creationTime.
      // I'll collect and sort in memory.
      .collect();

    const results = [];
    for (const player of players) {
      const team = await ctx.db.get(player.teamId);
      results.push({
        ...player,
        teamName: team?.name || "Unknown",
        teamShort: team?.shortName || "??",
      });
    }

    return results.sort((a, b) => b.goals - a.goals);
  },
});

export const listAllPlayers = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    const results = [];
    for (const player of players) {
      const team = await ctx.db.get(player.teamId);
      results.push({
        ...player,
        teamName: team?.name || "Unknown",
      });
    }
    return results;
  },
});
