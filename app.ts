import { configDotenv } from "dotenv";
import { Bot, InlineKeyboard, InputFile, Keyboard } from "grammy";
import { JSONFilePreset } from "lowdb/node";

import type { Boquet, Preferences } from "./entities.js";

configDotenv();

const token: string = process.env.API_KEY!;
const bot: Bot = new Bot(token);

const db = await JSONFilePreset("boquets.json", { boquets: [] });
const boquets: Boquet[] = db.data.boquets;
const bqNames: string[] = boquets.map((bq) => bq.name);

const sizes: Record<string, { multiplier: number; label: string }> = {
  s: { multiplier: 0.7, label: "S" },
  m: { multiplier: 1.0, label: "M" },
  l: { multiplier: 1.3, label: "L" },
};

bot.command("start", async (ctx) => {
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
});

bot.hears("Переглянути каталог", async (ctx) => {
  const chunkedNames = [];
  const chunkSize = 2;

  for (let i = 0; i < bqNames.length; i += chunkSize) {
    chunkedNames.push(bqNames.slice(i, i + chunkSize));
  }

  chunkedNames.push(["🏠 На головну"]);

  const keyboard = Keyboard.from(chunkedNames).resized();

  ctx.reply("Асортимент букетів", {
    reply_markup: keyboard,
  });
});

bot.hears(bqNames, async (ctx) => {
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
});

bot.callbackQuery(/size-(s|m|l)/, async (ctx) => {
  const selectedSize = ctx.callbackQuery.data.split("-")[1]!;
  const config = sizes[selectedSize];

  const text = ctx.callbackQuery.message?.caption || "";
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
});

bot.callbackQuery("buy-bq", async (ctx) => {
  await ctx.answerCallbackQuery({
    text: "Дякуємо за замовлення! :3",
    show_alert: true,
  });
});

bot.start();

bot.catch((err) => {
  console.log(err.message);
});
