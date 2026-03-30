import { InlineKeyboard } from "grammy";
import { getUser } from "../utils/storage.js";

export default function (bot) {
  bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    const wallet = getUser(userId);
    
    const keyboard = new InlineKeyboard();
    
    // Agar wallet already connected hai toh alag buttons
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
      // Agar wallet nahi hai toh Connect Wallet button pehle dikhao
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
      ? `🚀 *Sentient Shield Vault*\n\n🧠 AI-powered DeFi Engine\n🔐 Identity-based access\n🎮 Gamified rewards\n🛡️ Real-time risk alerts\n\n✅ *Wallet Connected:* ${wallet.slice(0,6)}...${wallet.slice(-4)}\n\nControl your vault directly from Telegram 👇`
      : `🚀 *Sentient Shield Vault*\n\n🧠 AI-powered DeFi Engine\n🔐 Identity-based access\n🎮 Gamified rewards\n🛡️ Real-time risk alerts\n\n⚠️ *Wallet not connected*\n\nPlease connect your wallet first to access your vault 👇`;

    await ctx.reply(message, { 
      reply_markup: keyboard,
      parse_mode: "Markdown"
    });
  });

  // 🔗 Connect Wallet button handler
  bot.callbackQuery("connect_wallet", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    // Import waitingUsers set from connect.js ya yahi handle karo
    // Simple approach: Direct message bhejo
    await ctx.editMessageText(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`\n\n⚠️ *Note:* Your wallet address will be stored securely.",
      { parse_mode: "Markdown" }
    );
    
    // User ko waiting state mein dalne ke liye global set use karna padega
    // Better approach: connect.js mein handle ho raha hai already
    // Toh hum directly connect command trigger kar sakte hain
  });
}