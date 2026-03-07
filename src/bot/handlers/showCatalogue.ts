import { Context, Keyboard } from "grammy";

export const showCatalogue = async (ctx: Context, bqNames: string[]) => {
  const chunkedNames = [];
  const chunkSize = 2;

  for (let i = 0; i < bqNames.length; i += chunkSize) {
    chunkedNames.push(bqNames.slice(i, i + chunkSize));
  }

  chunkedNames.push(["🏠 На головну"]);

  const keyboard = Keyboard.from(chunkedNames).resized();

  await ctx.reply("Асортимент букетів", {
    reply_markup: keyboard,
  });
};
