export default function (bot) {
  bot.command("claim", (ctx) => {
    ctx.reply(
      `🎁 Claim Rewards

Rewards available!

👉 Go to app and claim:
https://mprot.store/`
    );
  });
}