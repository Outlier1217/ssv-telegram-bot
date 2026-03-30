import { saveUser } from "../utils/storage.js";

// Global Set export karo taaki start.js bhi use kar sake
export const waitingUsers = new Set();

export default function (bot) {
  bot.command("connect", (ctx) => {
    waitingUsers.add(ctx.from.id);
    ctx.reply(
      "🔗 *Connect Your Wallet*\n\nPlease send your wallet address starting with `0x`\n\nExample: `0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4`",
      { parse_mode: "Markdown" }
    );
  });

  bot.on("message:text", (ctx) => {
    const userId = ctx.from.id;

    if (!waitingUsers.has(userId)) return;

    const wallet = ctx.message.text.trim();

    // basic validation
    if (!wallet.startsWith("0x") || wallet.length !== 42) {
      return ctx.reply("❌ Invalid wallet address. Please send a valid address starting with `0x` (42 characters)", { parse_mode: "Markdown" });
    }

    saveUser(userId, wallet);
    waitingUsers.delete(userId);

    ctx.reply("✅ *Wallet Connected Successfully!*\n\nUse /dashboard to view your vault.", { parse_mode: "Markdown" });
  });
}