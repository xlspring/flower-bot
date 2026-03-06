import { configDotenv } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js'

import { startBot } from "./bot/bot.js";

configDotenv();

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
}

startBot(process.env.TELEGRAM_API_KEY!);
