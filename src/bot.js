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
  connect(bot);

  // button handlers 👇
  bot.callbackQuery("dashboard", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🎮 Your Stats

XP: 120
Level: 3
Bonus: +15%`);
  });

  bot.callbackQuery("portfolio", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`📊 Market: Bull 🟢

60% Alpha
25% Stable
15% Risk`);
  });

  bot.callbackQuery("verify", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🔐 NexaID Verified

Score: 650
Bonus: +10%`);
  });

  bot.callbackQuery("deposit", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`💰 Deposit via app:

https://mprot.store/`);
  });

  bot.callbackQuery("claim", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🎁 Claim rewards in app:

https://mprot.store/`);
  });

  bot.callbackQuery("rebalance", (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(`🔄 Rebalance vault & earn bounty!

Open app:
https://mprot.store/`);
  });

  bot.command("leaderboard", (ctx) => {
  ctx.reply(`🏆 Leaderboard

1. 🥇 0xAb... → XP 500
2. 🥈 0x12... → XP 300
3. 🥉 You → XP 75 😎`);
});
}