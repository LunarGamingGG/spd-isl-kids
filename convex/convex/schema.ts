import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    shortName: v.string(),
    logoUrl: v.optional(v.string()),
  }),
  players: defineTable({
    name: v.string(),
    teamId: v.id("teams"),
    goals: v.number(),
    assists: v.number(),
    yellowCards: v.number(),
    redCards: v.number(),
    isCaptain: v.boolean(),
  }).index("by_team", ["teamId"]),
  matches: defineTable({
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    homeScore: v.number(),
    awayScore: v.number(),
    date: v.number(), // timestamp
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("completed")),
    type: v.union(v.literal("league"), v.literal("semi"), v.literal("final"), v.literal("playoff")),
    matchNumber: v.number(),
    matchday: v.number(),
    startTime: v.string(), // e.g. "18:00"
  }).index("by_status", ["status"]),
  gallery: defineTable({
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
    description: v.optional(v.string()),
  }),
  rules: defineTable({
    content: v.string(),
    order: v.number(),
  }),
  organizers: defineTable({
    name: v.string(),
    role: v.string(),
    contact: v.string(),
  }),
});
