import { InlineKeyboard } from "grammy";

import type { Context } from "grammy";
import type { Boquet } from "../entities.js";

export const changeSize = async (
  ctx: Context,
  boquets: Boquet[],
  sizes: Record<string, { multiplier: number; label: string }>,
) => {
  const selectedSize = ctx.callbackQuery!.data!.split("-")[1]!;
  const config = sizes[selectedSize];

  const text = ctx.callbackQuery!.message?.caption || "";
  const lines = text.split("\n\n");

  const basePrice = boquets.find((i) => i.name.includes(lines.at(0)!))?.price;

  if (basePrice && config) {
    const newPrice = (basePrice * config.multiplier).toFixed(2);

    const keyboard = new InlineKeyboard()
      .text("S", "size-s")
      .text("M", "size-m")
      .text("L", "size-l")
      .row()
      .text("Замовити!", "buy-bq");

    const cleanLines = lines.filter((line) => !line.includes("Ціна розміру"));
    const newCaption =
      `<b>${cleanLines.at(0)}</b>\n\n` +
      `${cleanLines.at(1)}\n\n` +
      `<blockquote>${cleanLines.at(2)}</blockquote>\n\n` +
      `<b>ℹ️ Ціна розміру ${config.label}: ${newPrice} UAH</b>`;

    try {
      await ctx.editMessageCaption({
        caption: newCaption,
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
      await ctx.answerCallbackQuery({ text: "Ціну оновлено!" });
    } catch (e) {
      console.log(e);
      await ctx.answerCallbackQuery({
        text: "Щось сталось, наші програмісти щас все зроблять",
      });
    }
  }
};
