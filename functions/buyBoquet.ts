import type { Context } from "grammy";

export const buyBoquet = async (ctx: Context) => {
  await ctx.answerCallbackQuery({
    text: "Дякуємо за замовлення! :3",
    show_alert: true,
  });
};
