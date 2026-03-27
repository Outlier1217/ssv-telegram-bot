import { getUser } from "../utils/storage.js";
import { getUserData } from "../utils/blockchain.js";

export default function (bot) {

  async function showDashboard(ctx) {
    const userId = ctx.from.id;
    const wallet = getUser(userId);

    if (!wallet) {
      return ctx.reply("❌ Please connect wallet first using /connect");
    }

    const data = await getUserData(wallet);

    // Format deposit and reward properly
    const depositText = data.deposit === "—" ? "Not available" : `${data.deposit} USDC`;
    const rewardText = data.reward === "—" ? "Not available" : `${data.reward} USDC`;

    return ctx.reply(
`📊 Your Vault

🔐 Verified: ${data.verified ? "✅ Yes" : "❌ No"}
⭐ Score: ${data.score}

💰 Deposit: ${depositText}
🎁 Rewards: ${rewardText}

🎮 XP: ${data.xp}
Level: ${data.level}
Bonus: +${data.level * 5}%`
    );
  }

  bot.command("dashboard", showDashboard);
  bot.callbackQuery("dashboard", async (ctx) => {
    ctx.answerCallbackQuery();
    await showDashboard(ctx);
  });
}