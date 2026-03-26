import { Bot } from "grammy";
import dotenv from "dotenv";
import { registerCommands } from "./src/bot.js";
import { getUserData } from "./src/utils/blockchain.js";
import fs from "fs";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

// register commands
registerCommands(bot);

// ✅ Track who already got alert
const alertedUsers = new Set();

// 🚀 AUTO ALERT SYSTEM (Rewards + Risk)
setInterval(async () => {
  if (!fs.existsSync("./data.json")) return;

  const users = JSON.parse(fs.readFileSync("./data.json"));

  for (const userId in users) {
    const wallet = users[userId];

    const data = await getUserData(wallet);

    // 🎁 Rewards Alert (ONLY ONCE)
    if (parseFloat(data.reward) > 50 && !alertedUsers.has(userId)) {
      await bot.api.sendMessage(
        userId,
        `🎁 Rewards Alert!

You have ${data.reward} USDC to claim 🚀`
      );

      alertedUsers.add(userId);
    }

    // 🔄 Reset alert if reward claimed (important)
    if (parseFloat(data.reward) < 10) {
      alertedUsers.delete(userId);
    }

    // 🛡️ ShieldBot Risk Alert (separate logic)
    if (parseFloat(data.deposit) > 1000) {
      await bot.api.sendMessage(
        userId,
        `⚠️ High Risk Alert

Large exposure detected.
Consider rebalancing your vault.`
      );
    }
  }
}, 60000); // every 1 min

bot.start();
console.log("🚀 SSV Bot running...");