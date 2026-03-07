import { Keyboard } from "grammy";
import {db} from "../../db/init.js";
import {eq} from "drizzle-orm";
import type {ShnyrContext} from "../context.js";
import {usersTable} from "../../db/schema.js";

export const homeMenu = async (ctx: ShnyrContext, isStarted?: boolean | undefined) => {
    if (isStarted && ctx.chatId) {
        const chatId = ctx.chatId.toString();

        const user = await db.query.usersTable.findFirst({
            where: (users) => eq(users.chatId, chatId)
        });

        if (!user) {
            await ctx.conversation.enter("firstTimeSetup");
            return;
        }
    }

  const keyboard: Keyboard = new Keyboard()
    .text("Переглянути каталог")
    .row()
    .text("Трекати замовлення (Не працює)")
    .row()
    .text("Маю питання (Не працює)").text("Налаштування")
    .resized();

  await ctx.reply(
    ">*SHNYR BOUQUET* — естетика та вишуканість у кожній пелюстці 🕊️\nВітаємо\n\nМи допоможемо обрати та доставити ідеальний букет для вашої особливої події\n\n✨ *Наші можливості:*\n• Перегляд актуального каталогу\n• Швидке оформлення замовлення\n• Трекінг доставки в реальному часі\nОберіть потрібний розділ у меню нижче, щоб розпочати 👇",
    {
      parse_mode: "MarkdownV2",
      reply_markup: keyboard,
    },
  );
};
