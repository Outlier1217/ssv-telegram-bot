export default function (bot) {
  bot.command("deposit", (ctx) => {
    ctx.reply(
      `💰 Deposit Guide

1. Connect Wallet
2. Approve USDC
3. Deposit into Vault

👉 Open App:
https://mprot.store/`
    );
  });
}