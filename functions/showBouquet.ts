import { InlineKeyboard, InputFile } from "grammy";

import type { Context } from "grammy";
import type { Boquet } from "../entities.js";

export const showBouquet = async (ctx: Context, boquets: Boquet[]) => {
  const name = ctx.message?.text;

  const bq = boquets.find((i) => i.name === name)!;

  if (!bq) {
    ctx.reply("Ой! Цей букет кудись зник з каталогу! 👀");
  }

  const inlineKb = new InlineKeyboard()
    .text("S", "size-s")
    .text("M", "size-m")
    .text("L", "size-l")
    .row()
    .text("Замовити!", "buy-bq");

  const caption =
    `<b>${bq.name}</b>\n\n` +
    `${bq.flowers.join(", ")}\n\n` +
    `<blockquote>${bq.description}</blockquote>\n\n` +
    `<b>ℹ️ Ціна розміру M: ${bq.price} UAH</b>`;

  await ctx.replyWithPhoto(new InputFile(`./${bq.imageUrl}`), {
    caption: caption,
    parse_mode: "HTML",
    reply_markup: inlineKb,
  });
};
