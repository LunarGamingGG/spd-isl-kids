import { query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const matches = await ctx.db
      .query("matches")
      .order("asc")
      .collect();
    
    const results = [];
    for (const match of matches) {
      const homeTeam = await ctx.db.get(match.homeTeamId);
      const awayTeam = await ctx.db.get(match.awayTeamId);
      results.push({
        ...match,
        homeTeam: homeTeam?.name,
        awayTeam: awayTeam?.name,
        homeShort: homeTeam?.shortName,
        awayShort: awayTeam?.shortName,
      });
    }
    return results;
  },
});
