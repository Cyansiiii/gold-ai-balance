import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .order("desc")
      .take(50);
  },
});

export const createTransaction = mutation({
  args: {
    type: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Mock transaction hash
    const tx_hash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");

    await ctx.db.insert("transactions", {
      user_id: userId,
      type: args.type,
      amount: args.amount,
      tx_hash,
      timestamp: Date.now(),
    });

    // Update user balance
    const user = await ctx.db.get(userId);
    if (user) {
      let newDeposited = user.depositedAmount || 0;
      let newArmBalance = user.armBalance || 0;

      if (args.type === "DEPOSIT") {
        newDeposited += args.amount;
        newArmBalance += args.amount; // 1:1 mint for simplicity
      } else if (args.type === "WITHDRAW") {
        newDeposited = Math.max(0, newDeposited - args.amount);
        newArmBalance = Math.max(0, newArmBalance - args.amount);
      }

      await ctx.db.patch(userId, {
        depositedAmount: newDeposited,
        armBalance: newArmBalance,
      });
    }
  },
});
