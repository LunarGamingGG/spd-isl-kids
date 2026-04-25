import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("Starting seed...");
    // Clear existing data to ensure exact match with requirements
    const existingTeams = await ctx.db.query("teams").collect();
    for (const team of existingTeams) {
      await ctx.db.delete(team._id);
    }
    const existingPlayers = await ctx.db.query("players").collect();
    for (const player of existingPlayers) {
      await ctx.db.delete(player._id);
    }
    const existingMatches = await ctx.db.query("matches").collect();
    for (const match of existingMatches) {
      await ctx.db.delete(match._id);
    }

    const teamData = [
      { name: "Sporting Delhi", shortName: "SD", players: ["Vivaan", "Chaitanya", "Hrick", "Pranav", "Suryansh"] },
      { name: "Bengaluru FC", shortName: "BFC", players: ["Ketan", "Harshad", "Prakhar", "Mokshith", "Avyaan"] },
      { name: "Hyderabad FC", shortName: "HFC", players: ["Devarsh", "Avyukt", "Harsha", "Anuj", "Sai"] },
      { name: "Mumbai City FC", shortName: "MCFC", players: ["Chinmay", "Rushan", "Siddharth", "Haasim", "Cherith"] },
      { name: "Chennaiyin FC", shortName: "CFC", players: ["Akshath", "Karthik", "Madhav", "Namish", "Dhairya"] },
    ];

    // Seed some initial G/A stats to make the leaderboard look active
    const sampleStats = [
      { name: "Vivaan", goals: 3, assists: 1 },
      { name: "Ketan", goals: 2, assists: 2 },
      { name: "Devarsh", goals: 2, assists: 1 },
      { name: "Chinmay", goals: 1, assists: 3 },
      { name: "Akshath", goals: 1, assists: 2 },
      { name: "Harshad", goals: 1, assists: 1 },
      { name: "Rushan", goals: 2, assists: 0 },
      { name: "Chaitanya", goals: 0, assists: 2 },
    ];

    const teamIds: Record<string, any> = {};
    for (const t of teamData) {
      const id = await ctx.db.insert("teams", { name: t.name, shortName: t.shortName });
      teamIds[t.shortName] = id;
      
      for (let i = 0; i < t.players.length; i++) {
        const playerName = t.players[i];
        const stats = sampleStats.find(s => s.name === playerName) || { goals: 0, assists: 0 };
        
        await ctx.db.insert("players", {
          name: playerName,
          teamId: id,
          goals: stats.goals,
          assists: stats.assists,
          yellowCards: 0,
          redCards: 0,
          isCaptain: i === 0,
        });
      }
    }

    // Placeholder teams for Semi-finals and Finals
    const placeholders = [
      { name: "LEAGUE 1ST", shortName: "L1" },
      { name: "LEAGUE 2ND", shortName: "L2" },
      { name: "LEAGUE 3RD", shortName: "L3" },
      { name: "LEAGUE 4TH", shortName: "L4" },
      { name: "3RD PLACE PLAYOFF", shortName: "3PP" },
      { name: "LSF1 VS LSF2", shortName: "LSF12" },
      { name: "GRAND FINAL", shortName: "GF" },
      { name: "WSF1 VS WSF2", shortName: "WSF12" },
    ];

    for (const p of placeholders) {
      teamIds[p.shortName] = await ctx.db.insert("teams", { name: p.name, shortName: p.shortName });
    }

    const startDate = new Date("2026-05-10T18:00:00Z").getTime();
    const matches = [
      // MATCHDAY 01
      { matchday: 1, home: "BFC", away: "MCFC", time: "18:00" },
      { matchday: 1, home: "CFC", away: "SD", time: "20:00" },
      // MATCHDAY 02
      { matchday: 2, home: "HFC", away: "BFC", time: "18:00" },
      { matchday: 2, home: "MCFC", away: "CFC", time: "20:00" },
      // MATCHDAY 03
      { matchday: 3, home: "SD", away: "HFC", time: "18:00" },
      { matchday: 3, home: "BFC", away: "CFC", time: "20:00" },
      // MATCHDAY 04
      { matchday: 4, home: "MCFC", away: "SD", time: "18:00" },
      { matchday: 4, home: "HFC", away: "CFC", time: "20:00" },
      // MATCHDAY 05
      { matchday: 5, home: "SD", away: "BFC", time: "18:00" },
      { matchday: 5, home: "MCFC", away: "HFC", time: "20:00" },
      // MATCHDAY 06
      { matchday: 6, home: "CFC", away: "BFC", time: "18:00" },
      { matchday: 6, home: "SD", away: "MCFC", time: "20:00" },
      // MATCHDAY 07
      { matchday: 7, home: "HFC", away: "CFC", time: "18:00" },
      { matchday: 7, home: "BFC", away: "SD", time: "20:00" },
      // MATCHDAY 08
      { matchday: 8, home: "MCFC", away: "HFC", time: "18:00" },
      { matchday: 8, home: "CFC", away: "BFC", time: "20:00" },
      // MATCHDAY 09 - SEMI FINALS
      { matchday: 9, home: "L1", away: "L4", time: "18:00", type: "semi" },
      { matchday: 9, home: "L2", away: "L3", time: "20:00", type: "semi" },
      // MATCHDAY 10 - FINALS
      { matchday: 10, home: "3PP", away: "LSF12", time: "18:00", type: "playoff" },
      { matchday: 10, home: "GF", away: "WSF12", time: "20:00", type: "final" },
    ];

    let matchCount = 1;
    for (const m of matches) {
      await ctx.db.insert("matches", {
        homeTeamId: teamIds[m.home],
        awayTeamId: teamIds[m.away],
        homeScore: 0,
        awayScore: 0,
        matchday: m.matchday,
        startTime: m.time,
        date: startDate + (m.matchday - 1) * 24 * 60 * 60 * 1000,
        status: "upcoming",
        type: (m as any).type || "league",
        matchNumber: matchCount++,
      });
    }

    const existingRules = await ctx.db.query("rules").collect();
    for (const rule of existingRules) {
      await ctx.db.delete(rule._id);
    }

    const rules = [
      "Each team consists of 5 players.",
      "Matches are 15 minutes per half with a 5-minute break.",
      "A win earns 3 points, a draw earns 1 point, and a loss earns 0 points.",
      "The top 4 teams at the end of the league phase qualify for the Semi-Finals.",
      "Fair play is mandatory. Any unsportsmanlike behavior will result in a yellow or red card.",
      "Substitutions can be made at any time during the match (rolling substitutions).",
    ];

    for (let i = 0; i < rules.length; i++) {
      await ctx.db.insert("rules", {
        content: rules[i],
        order: i + 1,
      });
    }

    return null;
  },
});
