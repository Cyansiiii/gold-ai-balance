import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const getVaultState = query({
  args: {},
  handler: async (ctx) => {
    const state = await ctx.db
      .query("vault_states")
      .withIndex("by_timestamp")
      .order("desc")
      .first();
    return state;
  },
});

export const getVaultHistory = query({
  args: {},
  handler: async (ctx) => {
    const history = await ctx.db
      .query("vault_states")
      .withIndex("by_timestamp")
      .order("desc")
      .take(30); // Last 30 data points
    return history.reverse();
  },
});

export const toggleRiskState = mutation({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("vault_states")
      .withIndex("by_timestamp")
      .order("desc")
      .first();

    if (latest) {
      await ctx.db.insert("vault_states", {
        ...latest,
        status: latest.status === "RISK_ON" ? "RISK_OFF" : "RISK_ON",
        timestamp: Date.now(),
      });
    }
  },
});

// Internal mutation to seed/update vault state (simulating AI updates)
export const updateVaultState = internalMutation({
  args: {
    status: v.string(),
    current_apy: v.number(),
    tvl: v.number(),
    gold_price: v.number(),
    qie_price: v.number(),
    analysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("vault_states", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const seedVaultData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("vault_states").first();
    if (existing) return;

    const now = Date.now();
    const points = 30;
    
    for (let i = 0; i < points; i++) {
      const time = now - (points - i) * 24 * 60 * 60 * 1000;
      // Simulate some movement
      const baseGold = 2000;
      const baseQie = 0.5;
      const random = Math.random();
      
      await ctx.db.insert("vault_states", {
        status: random > 0.7 ? "RISK_OFF" : "RISK_ON",
        current_apy: 5 + Math.random() * 10,
        tvl: 1000000 + Math.random() * 50000,
        gold_price: baseGold + Math.sin(i) * 50 + Math.random() * 20,
        qie_price: baseQie + Math.cos(i) * 0.1 + Math.random() * 0.05,
        timestamp: time,
        analysis: "Historical data point",
      });
    }
  },
});