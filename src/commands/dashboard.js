import { getUser } from "../utils/storage.js";
import { getUserData } from "../utils/blockchain.js";

export default function (bot) {

  // 🔹 Common function (reuse for command + button)
  async function showDashboard(ctx) {
    const userId = ctx.from.id;
    const wallet = getUser(userId);

    if (!wallet) {
      return ctx.reply("❌ Please connect wallet first using /connect");
    }

    const data = await getUserData(wallet);

    return ctx.reply(
`📊 Your Vault

🔐 Verified: ${data.verified ? "✅ Yes" : "❌ No"}
⭐ Score: ${data.score}

💰 Deposit: ${data.deposit} USDC
🎁 Rewards: ${data.reward} USDC

🎮 XP: ${data.xp}
Level: ${data.level}
Bonus: +${data.level * 5}%`
    );
  }

  // ✅ Command
  bot.command("dashboard", showDashboard);

  // ✅ Button click
  bot.callbackQuery("dashboard", async (ctx) => {
    ctx.answerCallbackQuery();
    await showDashboard(ctx);
  });
}