import { InlineKeyboard } from "grammy";

export default function (bot) {
  bot.command("start", (ctx) => {
    const keyboard = new InlineKeyboard()
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

    ctx.reply(
`🚀 Sentient Shield Vault

🧠 AI-powered DeFi Engine
🔐 Identity-based access
🎮 Gamified rewards
🛡️ Real-time risk alerts

Control your vault directly from Telegram 👇`,
      { reply_markup: keyboard }
    );
  });

  // button handler for leaderboard
  bot.callbackQuery("leaderboard", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🏆 Leaderboard

1. 🥇 0xAb... → XP 500
2. 🥈 0x12... → XP 300
3. 🥉 You → XP 75 😎`);
  });
}