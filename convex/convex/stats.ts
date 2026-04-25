import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
  args: {},
  returns: v.object({
    teamsCount: v.number(),
    matchesCount: v.number(),
    playersCount: v.number(),
    liveMatchesCount: v.number(),
    teams: v.array(v.any()),
  }),
  handler: async (ctx) => {
    const allTeams = await ctx.db.query("teams").collect();
    const teams = allTeams.filter(t => !["L1", "L2", "L3", "L4", "3PP", "LSF12", "GF", "WSF12"].includes(t.shortName));
    
    const matches = await ctx.db.query("matches").collect();
    const players = await ctx.db.query("players").collect();
    const liveMatches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .collect();

    return {
      teamsCount: teams.length,
      matchesCount: matches.length,
      playersCount: players.length,
      liveMatchesCount: liveMatches.length,
      teams,
    };
  },
});

export const getRecentMatches = query({
  args: { limit: v.number() },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    // Show upcoming matches in ascending order for now as tournament hasn't started
    const matches = await ctx.db
      .query("matches")
      .order("asc")
      .take(args.limit);
    
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
