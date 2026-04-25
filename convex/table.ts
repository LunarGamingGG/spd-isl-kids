import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTable = query({
  args: {},
  returns: v.array(v.object({
    teamId: v.id("teams"),
    name: v.string(),
    shortName: v.string(),
    played: v.number(),
    won: v.number(),
    drawn: v.number(),
    lost: v.number(),
    gf: v.number(),
    ga: v.number(),
    gd: v.number(),
    points: v.number(),
  })),
  handler: async (ctx) => {
    const allTeams = await ctx.db.query("teams").collect();
    // Only include real teams, not playoff placeholders
    const teams = allTeams.filter(t => !["L1", "L2", "L3", "L4", "3PP", "LSF12", "GF", "WSF12"].includes(t.shortName));
    
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();

    const table = teams.map(team => ({
      teamId: team._id,
      name: team.name,
      shortName: team.shortName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    }));

    for (const match of matches) {
      if (match.type !== "league") continue;
      
      const homeIdx = table.findIndex(t => t.teamId === match.homeTeamId);
      const awayIdx = table.findIndex(t => t.teamId === match.awayTeamId);

      if (homeIdx === -1 || awayIdx === -1) continue;

      table[homeIdx].played += 1;
      table[awayIdx].played += 1;
      table[homeIdx].gf += match.homeScore;
      table[homeIdx].ga += match.awayScore;
      table[awayIdx].gf += match.awayScore;
      table[awayIdx].ga += match.homeScore;

      if (match.homeScore > match.awayScore) {
        table[homeIdx].won += 1;
        table[homeIdx].points += 3;
        table[awayIdx].lost += 1;
      } else if (match.homeScore < match.awayScore) {
        table[awayIdx].won += 1;
        table[awayIdx].points += 3;
        table[homeIdx].lost += 1;
      } else {
        table[homeIdx].drawn += 1;
        table[homeIdx].points += 1;
        table[awayIdx].drawn += 1;
        table[awayIdx].points += 1;
      }
    }

    table.forEach(row => {
      row.gd = row.gf - row.ga;
    });

    return table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
  },
});
