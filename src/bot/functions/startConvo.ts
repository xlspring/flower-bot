import { Context, Keyboard } from "grammy";

export const startConvo = async (ctx: Context) => {
  const keyboard: Keyboard = new Keyboard()
    .text("Переглянути каталог")
    .row()
    .text("Трекати замовлення (Не працює)")
    .row()
    .text("Маю питання (Не працює)")
    .resized();

  await ctx.reply(
    ">*SHNYR BOUQUET* — естетика та вишуканість у кожній пелюстці 🕊️\nВітаємо\n\nМи допоможемо обрати та доставити ідеальний букет для вашої особливої події\n\n✨ *Наші можливості:*\n• Перегляд актуального каталогу\n• Швидке оформлення замовлення\n• Трекінг доставки в реальному часі\nОберіть потрібний розділ у меню нижче, щоб розпочати 👇",
    {
      parse_mode: "MarkdownV2",
      reply_markup: keyboard,
    },
  );
};
