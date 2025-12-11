"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";

// In a production environment, this should be in process.env.GOOGLE_API_KEY
const API_KEY = "AIzaSyDy42sn_dRoN4YNxGs3Q7FeZu8bm_lNJRY"; 

export const analyzeMarket = action({
  args: {},
  handler: async (ctx) => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Simulate fetching market data (in a real app, fetch from an API)
      const marketData = {
        goldPrice: 2000 + Math.random() * 100 - 50,
        qiePrice: 0.45 + Math.random() * 0.1 - 0.05,
        volatilityIndex: 15 + Math.random() * 10,
        globalUncertainty: Math.random() > 0.5 ? "High" : "Moderate",
      };

      const prompt = `
        You are an expert AI financial analyst for the Aurum-AI liquidity protocol.
        Analyze the following market data and decide whether the vault should be "RISK_ON" (seeking yield) or "RISK_OFF" (preserving capital).
        
        Market Data:
        - Gold Price: $${marketData.goldPrice.toFixed(2)}
        - QIE Token Price: $${marketData.qiePrice.toFixed(4)}
        - Volatility Index: ${marketData.volatilityIndex.toFixed(2)}
        - Global Uncertainty: ${marketData.globalUncertainty}

        Provide a JSON response with two fields:
        1. "status": either "RISK_ON" or "RISK_OFF"
        2. "analysis": a concise 1-2 sentence explanation of your decision based on the data.
        
        Do not include markdown formatting in the response, just the raw JSON string.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the text to ensure it's valid JSON
      const jsonStr = text.replace(/(\r\n|\n|\r)/gm, '');
      
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error) {
      console.error("Error in analyzeMarket:", error);
      throw error;
    }
  }
});