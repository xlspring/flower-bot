import {Bot, type Context} from "grammy";

import { homeMenu } from "./handlers/homeMenu.js";
import { showCatalogue } from "./handlers/showCatalogue.js";
import { showBouquet } from "./handlers/showBouquet.js";
import { changeSize } from "./handlers/changeSize.js";
import { buyBoquet } from "./handlers/buyBoquet.js";
import { firstTimeSetup } from "./handlers/firstTimeSetup.js";
import { showSettings } from "./handlers/showSettings.js";

import { db } from "../db/init.js";

import { bouquetsTable } from "../db/schema.js";
import {type ConversationFlavor, conversations, createConversation} from "@grammyjs/conversations";

const bouquets = await db.select().from(bouquetsTable);
const bqNames: string[] = bouquets.map((bq) => bq.name);

const sizes: Record<string, { multiplier: number; label: string }> = {
    s: { multiplier: 0.7, label: "S" },
    m: { multiplier: 1.0, label: "M" },
    l: { multiplier: 1.3, label: "L" },
};

export function startBot(token: string) {
    const bot = new Bot<ConversationFlavor<Context>>(token);

    bot.use(conversations());
    bot.use(createConversation(firstTimeSetup));
    bot.use(createConversation(showSettings));

    bot.command("start", async (ctx) => homeMenu(ctx, true));
    bot.hears("🏠 На головну", async (ctx) => homeMenu(ctx));

    bot.hears("Переглянути каталог", async (ctx) => showCatalogue(ctx, bqNames));
    bot.hears("Налаштування", async (ctx) => await ctx.conversation.enter("showSettings"));

    bot.hears(bqNames, async (ctx) => showBouquet(ctx, bouquets));

    bot.callbackQuery(/size-([sml])/, async (ctx) =>
        changeSize(ctx, bouquets, sizes),
    );

    bot.callbackQuery("buy-bq", async (ctx) => buyBoquet(ctx));

    bot
        .start()
        .then(() => {
            console.log("Bot started!");
        });

    bot.catch((err) => {
        console.log(err.message);
    });
}