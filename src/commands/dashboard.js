import { getUser, saveUser } from "../utils/storage.js";
import { getUserData } from "../utils/blockchain.js";
import { InlineKeyboard } from "grammy";

const waitingUsers = new Set();

export default function (bot) {
  
  // 📊 Dashboard Show Function
  async function showDashboard(ctx) {
    const userId = ctx.from.id;
    const wallet = getUser(userId);

    if (!wallet) {
      const keyboard = new InlineKeyboard()
        .text("🔗 Connect Wallet", "connect_wallet");
      
      return ctx.reply(
        "❌ No wallet connected!\n\nPlease connect your wallet first using /connect or click below 👇",
        { reply_markup: keyboard }
      );
    }

    const data = await getUserData(wallet);
    
    const depositText = data.deposit === "—" ? "Not available" : `${parseFloat(data.deposit).toFixed(4)} USDC`;
    const rewardText = data.reward === "—" ? "Not available" : `${parseFloat(data.reward).toFixed(4)} USDC`;
    const bountiesText = data.bounties === "—" ? "Not available" : `${parseFloat(data.bounties).toFixed(4)} USDC`;
    
    // Level Bonus Calculation
    const levelBonus = parseInt(data.level) * 5;
    const totalBonus = levelBonus + parseInt(data.repBonus);

    const message = `
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
    `;

    const keyboard = new InlineKeyboard()
      .text("🔄 Refresh", "refresh_dashboard")
      .text("🔗 Disconnect", "disconnect_wallet")
      .row()
      .text("💰 Deposit", "deposit_quick")
      .text("🎁 Claim", "claim_quick")
      .row()
      .text("🌾 Harvest", "harvest_quick")
      .text("🔄 Rebalance", "rebalance_quick");

    await ctx.reply(message, { 
      reply_markup: keyboard,
      parse_mode: "Markdown"
    });
  }

  // 🔗 Connect Command
  bot.command("connect", (ctx) => {
    waitingUsers.add(ctx.from.id);
    ctx.reply(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`",
      { parse_mode: "Markdown" }
    );
  });

  // 📝 Handle wallet address from users
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    
    if (!waitingUsers.has(userId)) return;
    
    const wallet = ctx.message.text.trim();
    
    // Validate wallet address
    if (!wallet.startsWith("0x") || wallet.length !== 42) {
      return ctx.reply("❌ Invalid wallet address!\n\nPlease send a valid Ethereum address starting with `0x` (42 characters)", { parse_mode: "Markdown" });
    }
    
    saveUser(userId, wallet);
    waitingUsers.delete(userId);
    
    // Show dashboard after successful connection
    ctx.reply("✅ *Wallet Connected Successfully!*\n\nLoading your dashboard...", { parse_mode: "Markdown" });
    
    // Auto-show dashboard after 1 second
    setTimeout(async () => {
      await showDashboard(ctx);
    }, 1000);
  });

  // ✅ Dashboard Command
  bot.command("dashboard", showDashboard);
  
  // 🔄 Refresh Button Handler
  bot.callbackQuery("refresh_dashboard", async (ctx) => {
    await ctx.answerCallbackQuery("Refreshing... 🔄");
    await showDashboard(ctx);
  });
  
  // 🔗 Connect Button Handler
  bot.callbackQuery("connect_wallet", async (ctx) => {
    await ctx.answerCallbackQuery();
    waitingUsers.add(ctx.from.id);
    await ctx.editMessageText(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`",
      { parse_mode: "Markdown" }
    );
  });
  
  // 🔌 Disconnect Button Handler
  bot.callbackQuery("disconnect_wallet", async (ctx) => {
    const { saveUser } = await import("../utils/storage.js");
    saveUser(ctx.from.id, null);
    await ctx.answerCallbackQuery("Wallet disconnected!");
    await ctx.editMessageText(
      "🔌 *Wallet Disconnected*\n\nUse /connect to connect your wallet again.",
      { parse_mode: "Markdown" }
    );
  });

  // Quick Action Handlers
  bot.callbackQuery("deposit_quick", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.reply(
      "💰 *Deposit Guide*\n\n1. Open dApp\n2. Approve USDC\n3. Deposit into Vault\n\n👉 [Open dApp](https://mprot.store/)",
      { parse_mode: "Markdown" }
    );
  });

  bot.callbackQuery("claim_quick", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.reply(
      "🎁 *Claim Rewards*\n\nYour rewards are ready to claim!\n\n👉 [Claim on dApp](https://mprot.store/)",
      { parse_mode: "Markdown" }
    );
  });

  bot.callbackQuery("harvest_quick", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.reply(
      "🌾 *Harvest Yield*\n\nGenerate yield from your deposits!\n\n👉 [Harvest on dApp](https://mprot.store/)",
      { parse_mode: "Markdown" }
    );
  });

  bot.callbackQuery("rebalance_quick", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.reply(
      "🔄 *Rebalance Vault*\n\nEarn bounty by rebalancing!\n\n👉 [Rebalance on dApp](https://mprot.store/)",
      { parse_mode: "Markdown" }
    );
  });
}