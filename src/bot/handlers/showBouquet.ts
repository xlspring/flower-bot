import { InlineKeyboard, InputFile } from "grammy";
import { db } from "../../db/init.js";

import type { Context } from "grammy";
import {bouquetsTable, bouquetsToFlowers, flowersTable} from "../../db/schema.js";
import {eq} from "drizzle-orm";

export const showBouquet = async (ctx: Context) => {
    const name = ctx.message?.text;

    if (!name) return;

    const bq = await db.query.bouquetsTable.findFirst({
        where: (bouquets) => eq(bouquets.name, name)
    });

    if (!bq) {
        await ctx.reply("Ой! Цей букет кудись зник з каталогу! 👀");
        return;
    }

    const inlineKb = new InlineKeyboard()
        .text("S", "size-s")
        .text("M", "size-m")
        .text("L", "size-l")
        .row()
        .text("Замовити!", "buy-bq");

    const flowers = await db
        .select({ name: flowersTable.name })
        .from(flowersTable)
        .innerJoin(bouquetsToFlowers, eq(bouquetsToFlowers.flowerId, flowersTable.id))
        .where(eq(bouquetsToFlowers.bouquetId, bq.id));

    const flowerNames = flowers.map(f => f.name);

    const caption =
        `<b>${bq.name}</b>\n\n` +
        `${flowerNames.join(", ")}\n\n` +
        `<blockquote>${bq.description}</blockquote>\n\n` +
        `<b>ℹ️ Ціна розміру M: ${bq.priceInCents / 100} UAH</b>`;

    await ctx.replyWithPhoto(new InputFile(`./${bq.imageUrl}`), {
        caption: caption,
        parse_mode: "HTML",
        reply_markup: inlineKb,
    });
};
