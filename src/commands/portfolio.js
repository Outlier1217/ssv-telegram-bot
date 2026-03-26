export default function (bot) {
  bot.command("portfolio", (ctx) => {
    ctx.reply(
      `📊 Market Status: Bull 🟢

Allocation:
60% AlphaVault
25% StableCore
15% RiskGuard`
    );
  });
}