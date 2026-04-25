import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDetails = query({
  args: { teamId: v.id("teams") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    const players = await ctx.db
      .query("players")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();

    let played = 0;
    let won = 0;
    let goalsScored = 0;

    for (const match of matches) {
      if (match.homeTeamId === args.teamId) {
        played++;
        goalsScored += match.homeScore;
        if (match.homeScore > match.awayScore) won++;
      } else if (match.awayTeamId === args.teamId) {
        played++;
        goalsScored += match.awayScore;
        if (match.awayScore > match.homeScore) won++;
      }
    }

    return {
      ...team,
      players: players.sort((a, b) => {
        if (a.isCaptain) return -1;
        if (b.isCaptain) return 1;
        return b.goals - a.goals;
      }),
      stats: {
        played,
        won,
        goalsScored,
      }
    };
  },
});

export const list = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});
