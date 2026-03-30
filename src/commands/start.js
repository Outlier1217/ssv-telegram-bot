import { InlineKeyboard } from "grammy";
import { getUser } from "../utils/storage.js";
import { waitingUsers } from "./connect.js";

export default function (bot) {
  bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    const wallet = getUser(userId);
    
    const keyboard = new InlineKeyboard();
    
    if (wallet) {
      keyboard
        .text("📊 Dashboard", "dashboard")
        .text("📈 Portfolio", "portfolio")
        .row()
        .text("🔐 Verify", "verify")
        .text("💰 Deposit", "deposit")
        .row()
        .text("🎁 Claim", "claim")
        .text("🔄 Rebalance", "rebalance")
        .row()
        .text("🏆 Leaderboard", "leaderboard")
        .row()
        .url("🚀 Open App", "https://mprot.store/");
    } else {
      keyboard
        .text("🔗 Connect Wallet", "connect_wallet")
        .row()
        .text("📊 Dashboard", "dashboard")
        .text("📈 Portfolio", "portfolio")
        .row()
        .text("🔐 Verify", "verify")
        .text("💰 Deposit", "deposit")
        .row()
        .text("🎁 Claim", "claim")
        .text("🔄 Rebalance", "rebalance")
        .row()
        .text("🏆 Leaderboard", "leaderboard")
        .row()
        .url("🚀 Open App", "https://mprot.store/");
    }

    const message = wallet 
      ? `🚀 *Sentient Shield Vault*\n\n🧠 AI-powered DeFi Engine\n🔐 Identity-based access\n🎮 Gamified rewards\n🛡️ Real-time risk alerts\n\n✅ *Wallet Connected:* \`${wallet.slice(0,6)}...${wallet.slice(-4)}\`\n\nControl your vault directly from Telegram 👇`
      : `🚀 *Sentient Shield Vault*\n\n🧠 AI-powered DeFi Engine\n🔐 Identity-based access\n🎮 Gamified rewards\n🛡️ Real-time risk alerts\n\n⚠️ *Wallet not connected*\n\nPlease connect your wallet first to access your vault 👇`;

    await ctx.reply(message, { 
      reply_markup: keyboard,
      parse_mode: "Markdown"
    });
  });

  // 🔗 Connect Wallet button handler - FIXED
  bot.callbackQuery("connect_wallet", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    // Add user to waiting state
    waitingUsers.add(ctx.from.id);
    
    // Delete the old message and send new one (better than edit)
    await ctx.deleteMessage();
    
    await ctx.reply(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`\n\n⚠️ *Note:* Your wallet address will be stored securely.\n\n💡 *Tip:* You can also use /connect command anytime.",
      { parse_mode: "Markdown" }
    );
  });
}