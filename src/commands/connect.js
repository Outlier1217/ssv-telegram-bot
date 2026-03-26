import { saveUser } from "../utils/storage.js";

const waitingUsers = new Set();

export default function (bot) {
  bot.command("connect", (ctx) => {
    waitingUsers.add(ctx.from.id);
    ctx.reply("🔗 Send your wallet address:");
  });

  bot.on("message:text", (ctx) => {
    const userId = ctx.from.id;

    // check if user is in waiting state
    if (!waitingUsers.has(userId)) return;

    const wallet = ctx.message.text;

    // basic validation
    if (!wallet.startsWith("0x") || wallet.length < 10) {
      return ctx.reply("❌ Invalid wallet address. Try again.");
    }

    saveUser(userId, wallet);
    waitingUsers.delete(userId);

    ctx.reply("✅ Wallet connected successfully!");
  });
}