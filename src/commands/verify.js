import { getUser } from "../utils/storage.js";
import { getUserData } from "../utils/blockchain.js";

export default function (bot) {

  // 🔹 Common function (reuse)
  async function showVerify(ctx) {
    const userId = ctx.from.id;
    const wallet = getUser(userId);

    if (!wallet) {
      return ctx.reply("❌ Please connect wallet first using /connect");
    }

    const data = await getUserData(wallet);

    return ctx.reply(
`🔐 NexaID Status

${data.verified ? "✅ Verified" : "❌ Not Verified"}
⭐ Score: ${data.score}

Bonus: ${
  data.score > 800 ? "+20%" :
  data.score > 500 ? "+10%" : "0%"
}`
    );
  }

  // ✅ command
  bot.command("verify", showVerify);

  // ✅ button click
  bot.callbackQuery("verify", async (ctx) => {
    ctx.answerCallbackQuery();
    await showVerify(ctx);
  });
}