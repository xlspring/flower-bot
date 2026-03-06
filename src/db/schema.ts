import { boolean, integer, pgTable, text, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const flowersTable = pgTable("flowers", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 128 }).notNull().unique(),
});

export const bouquetsTable = pgTable("bouquets", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 128 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    description: text("description").notNull(),
    priceInCents: integer("price_with_frac").notNull(), // $10.50 = 1050
});

export const bouquetsToFlowers = pgTable("bouquets_to_flowers", {
    bouquetId: uuid("bouquet_id").references(() => bouquetsTable.id),
    flowerId: uuid("flower_id").references(() => flowersTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.bouquetId, t.flowerId] }),
}));

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: varchar("chat_id", { length: 32 }).notNull().unique(),
    phoneNumber: varchar("phone_number", { length: 32 }),
    language: varchar("language", { length: 32 }).default("uk").notNull()
});

export const usersToBlockedFlowers = pgTable("users_to_blocked_flowers", {
    userId: uuid("user_id").references(() => usersTable.id),
    flowerId: uuid("flower_id").references(() => flowersTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.flowerId] }),
}));

export const ordersTable = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => usersTable.id),
    isPaid: boolean("is_paid").default(false).notNull(),
    totalAmount: integer("total_amount").notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    deliveryStatus: varchar("delivery_status", { length: 64 }).default("pending").notNull(),
});