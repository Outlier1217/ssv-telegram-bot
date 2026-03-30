import start from "./commands/start.js";
import dashboard from "./commands/dashboard.js";
import portfolio from "./commands/portfolio.js";
import verify from "./commands/verify.js";
import deposit from "./commands/deposit.js";
import claim from "./commands/claim.js";
import rebalance from "./commands/rebalance.js";
import connect from "./commands/connect.js";

export function registerCommands(bot) {
  // command handlers
  start(bot);
  dashboard(bot);
  portfolio(bot);
  verify(bot);
  deposit(bot);
  claim(bot);
  rebalance(bot);
  connect(bot);  // ✅ Make sure this is registered

  // button handlers
  bot.callbackQuery("portfolio", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`📊 *Market Status:* Bull 🟢\n\n*Allocation:*\n60% AlphaVault\n25% StableCore\n15% RiskGuard\n\n👉 [Open App](https://mprot.store/)`, { parse_mode: "Markdown" });
  });

  bot.callbackQuery("deposit", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`💰 *Deposit Guide*\n\n1. Connect Wallet\n2. Approve USDC\n3. Deposit into Vault\n\n👉 [Open App](https://mprot.store/)`, { parse_mode: "Markdown" });
  });

  bot.callbackQuery("claim", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🎁 *Claim Rewards*\n\nRewards available!\n\n👉 [Open App](https://mprot.store/)`, { parse_mode: "Markdown" });
  });

  bot.callbackQuery("rebalance", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🔄 *Rebalance Opportunity*\n\nEarn bounty by rebalancing vault!\n\n👉 [Open App](https://mprot.store/)`, { parse_mode: "Markdown" });
  });

  bot.callbackQuery("leaderboard", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🏆 *Leaderboard*\n\n1. 🥇 0xAb... → XP 500\n2. 🥈 0x12... → XP 300\n3. 🥉 You → XP 75 😎\n\nKeep earning XP to climb the ranks!`, { parse_mode: "Markdown" });
  });
}