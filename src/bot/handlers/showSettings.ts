import type {ShnyrContext} from "../context.js";
import {db} from "../../db/init.js";
import {eq} from "drizzle-orm";
import {InlineKeyboard} from "grammy";
import {Conversation} from "@grammyjs/conversations";
import {homeMenu} from "./homeMenu.js";

export const showSettings = async (conversation: Conversation<ShnyrContext>, ctx: ShnyrContext) => {
    const settingKeyboard = new InlineKeyboard()
        .text("Пройти налаштування заново", "reset")
        .row()
        .text("Змінити квіти", "setup-flowers");

    await ctx.reply("<b>Налаштування</b>\n\n- Для того щоб змінити номер телефону чи мову, натисніть <i>Пройти налаштування заново</i>\n- Щоб прибрати букети з квітами, які вам не подобаються, натисніть <i>Змінити квіти</i>", {
        reply_markup: settingKeyboard, parse_mode: "HTML",
    });

    const response = await conversation.waitForCallbackQuery(["reset", "setup-flowers"]);

    switch (response.callbackQuery.data) {
        case "reset":
            await ctx.conversation.enter("firstTimeSetup");
            return;
        case "setup-flowers":
            await ctx.conversation.enter("flowersSetup");
            return;
        default:
            await ctx.reply("Ми нічого не зрозуміли, але повернемо вас до головного меню");
            await homeMenu(ctx);
            return;
    }
}