import { configDotenv } from "dotenv";

import { startBot } from "./bot/bot.js";

configDotenv();

try {
    startBot(process.env.TELEGRAM_API_KEY!);
} catch (err) {
    console.error(err);
}
