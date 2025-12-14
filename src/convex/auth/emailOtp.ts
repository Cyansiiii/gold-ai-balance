import { Email } from "@convex-dev/auth/providers/Email";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    // Use a simple random number generator for robustness
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
  },
  async sendVerificationRequest({ identifier: email, token }) {
    try {
      const response = await fetch("https://email.vly.ai/send_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "vlytothemoon2025",
        },
        body: JSON.stringify({
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "Aurum-AI",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Failed to send OTP: ${response.status} ${text}`);
        throw new Error(`Failed to send OTP: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send verification code");
    }
  },
});