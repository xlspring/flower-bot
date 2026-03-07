import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing!");

export const db = drizzle(connectionString, { schema });