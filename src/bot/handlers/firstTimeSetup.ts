import {InlineKeyboard} from "grammy";
import {Conversation} from "@grammyjs/conversations";
import {db} from "../../db/init.js";
import {usersTable} from "../../db/schema.js";
import {homeMenu} from "./homeMenu.js";
import type {ShnyrContext} from "../context.js";

export const firstTimeSetup = async (conversation: Conversation<ShnyrContext>, ctx: ShnyrContext) => {
    const langKeyboard = new InlineKeyboard()
        .text("🇺🇦 Українська", "lang-ua")
        .text("🇬🇧 English", "lang-en");

    await ctx.reply(
        "🇺🇦 Будь ласка, оберіть мову / 🇬🇧 Please select your language:",
        { reply_markup: langKeyboard }
    );

    const langResponse = await conversation.waitForCallbackQuery(["lang-ua", "lang-en"]);
    const language = langResponse.callbackQuery.data.slice(-2);

    await ctx.reply("Введіть ваш номер телефону. Це треба для доставки");
    const phoneResponse = await conversation.waitFor("message:text");
    const phoneNumber = phoneResponse.message.text; // We do not check the phone number, this is just a mock project

    await db.insert(usersTable).values({
        chatId: ctx.chatId!.toString(),
        language: language,
        phoneNumber: phoneNumber,
    });

    await homeMenu(ctx);
};