import { timestamp, integer, text, pgTable } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
  id: text().primaryKey(),
  orderId: text().notNull(),
  amount: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});