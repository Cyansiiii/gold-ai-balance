import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Custom fields for Aurum-AI
      walletAddress: v.optional(v.string()),
      armBalance: v.optional(v.number()),
      depositedAmount: v.optional(v.number()),
      riskPreference: v.optional(v.string()), // "Aggressive" | "Safe"
    }).index("email", ["email"]).index("by_walletAddress", ["walletAddress"]),

    vault_states: defineTable({
      status: v.string(), // "RISK_ON" | "RISK_OFF"
      current_apy: v.number(),
      tvl: v.number(),
      gold_price: v.number(),
      qie_price: v.number(),
      timestamp: v.number(),
    }).index("by_timestamp", ["timestamp"]),

    transactions: defineTable({
      user_id: v.id("users"),
      type: v.string(), // "DEPOSIT" | "WITHDRAW" | "REBALANCE"
      amount: v.number(),
      tx_hash: v.string(),
      timestamp: v.number(),
    }).index("by_user", ["user_id"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;