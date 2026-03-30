import { saveUser } from "../utils/storage.js";
import { getUserData } from "../utils/blockchain.js";

export const waitingUsers = new Set();

export default function (bot) {
  bot.command("connect", (ctx) => {
    waitingUsers.add(ctx.from.id);
    ctx.reply(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`",
      { parse_mode: "Markdown" }
    );
  });

  // Message handler for wallet address
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    
    // Check if user is waiting for wallet connection
    if (!waitingUsers.has(userId)) return;
    
    const wallet = ctx.message.text.trim();
    
    // Validate wallet address
    if (!wallet.startsWith("0x") || wallet.length !== 42) {
      waitingUsers.delete(userId); // Remove from waiting state
      return ctx.reply(
        "❌ *Invalid wallet address!*\n\nPlease send a valid Ethereum address starting with `0x` (42 characters)\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`\n\nUse /connect to try again.",
        { parse_mode: "Markdown" }
      );
    }
    
    // Save wallet
    saveUser(userId, wallet);
    waitingUsers.delete(userId);
    
    // Send success message
    await ctx.reply("✅ *Wallet Connected Successfully!*\n\nLoading your dashboard...", { parse_mode: "Markdown" });
    
    // Import and show dashboard
    try {
      const { getUser } = await import("../utils/storage.js");
      const savedWallet = getUser(userId);
      
      if (savedWallet) {
        const data = await getUserData(savedWallet);
        
        const depositText = data.deposit === "—" ? "Not available" : `${parseFloat(data.deposit).toFixed(4)} USDC`;
        const rewardText = data.reward === "—" ? "Not available" : `${parseFloat(data.reward).toFixed(4)} USDC`;
        const bountiesText = data.bounties === "—" ? "Not available" : `${parseFloat(data.bounties).toFixed(4)} USDC`;
        
        const levelBonus = parseInt(data.level) * 5;
        const totalBonus = levelBonus + parseInt(data.repBonus);
        
        const dashboardMessage = `
📊 *Your Sentient Shield Vault Dashboard*

┌─────────────────────────┐
│ 🔐 *NexaID Status*       │
├─────────────────────────┤
│ ✓ Verified: ${data.verified ? "✅ Yes" : "❌ No"}
│ ⭐ Score: ${data.score}
└─────────────────────────┘

┌─────────────────────────┐
│ 💰 *Vault Balance*       │
├─────────────────────────┤
│ 🏦 Deposit: ${depositText}
│ 🎁 Rewards: ${rewardText}
│ 💎 Bounties: ${bountiesText}
└─────────────────────────┘

┌─────────────────────────┐
│ 🎮 *Gamification*        │
├─────────────────────────┤
│ ⭐ Level: ${data.level}
│ 📈 XP: ${data.xp}
│ 🎯 Bonus: +${levelBonus}%
│ 🏆 Rep Bonus: +${data.repBonus}%
│ ✨ Total: +${totalBonus}%
└─────────────────────────┘

┌─────────────────────────┐
│ 💳 *Wallet Balance*      │
├─────────────────────────┤
│ 💵 USDC: ${parseFloat(data.usdcBalance).toFixed(4)}
└─────────────────────────┘

🛡️ *ShieldBot Active* | 🔐 *NexaID Secured*

Use /dashboard anytime to see this again.
        `;
        
        await ctx.reply(dashboardMessage, { parse_mode: "Markdown" });
      } else {
        await ctx.reply("⚠️ Something went wrong. Please try /connect again.", { parse_mode: "Markdown" });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      await ctx.reply("✅ Wallet connected! Use /dashboard to view your vault.", { parse_mode: "Markdown" });
    }
  });
}