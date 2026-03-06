import { Bot } from "grammy";
import { JSONFilePreset } from "lowdb/node";

import { startConvo } from "./functions/startConvo.js";
import { showCatalogue } from "./functions/showCatalogue.js";
import { showBouquet } from "./functions/showBouquet.js";
import { changeSize } from "./functions/changeSize.js";
import { buyBoquet } from "./functions/buyBoquet.js";

import type { Boquet, Preferences } from "../../entities.js";

const db = await JSONFilePreset("boquets.json", { boquets: [] });
const boquets: Boquet[] = db.data.boquets;
const bqNames: string[] = boquets.map((bq) => bq.name);

const sizes: Record<string, { multiplier: number; label: string }> = {
    s: { multiplier: 0.7, label: "S" },
    m: { multiplier: 1.0, label: "M" },
    l: { multiplier: 1.3, label: "L" },
};

export function startBot(token: string) {
    const bot: Bot = new Bot(token);

    bot.command("start", async (ctx) => startConvo(ctx));
    bot.hears("🏠 На головну", async (ctx) => startConvo(ctx));

    bot.hears("Переглянути каталог", async (ctx) => showCatalogue(ctx, bqNames));

    bot.hears(bqNames, async (ctx) => showBouquet(ctx, boquets));

    bot.callbackQuery(/size-([sml])/, async (ctx) =>
        changeSize(ctx, boquets, sizes),
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