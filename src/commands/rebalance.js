export default function (bot) {
  bot.command("rebalance", (ctx) => {
    ctx.reply(
      `🔄 Rebalance Opportunity

Earn bounty by rebalancing vault!

👉 Open App:
https://mprot.store/`
    );
  });
}