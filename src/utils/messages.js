bot.command("alert", (ctx) => {
  ctx.reply(
    `⚠️ High Risk Detected

This transaction may lead to loss.
Proceed carefully.`
  );
});