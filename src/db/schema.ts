import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const farmers = pgTable("farmers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  assigned_crops: jsonb("assigned_crops").$type<string[]>().notNull(),
  last_updated: text("last_updated").notNull(),
});

export type Farmer = typeof farmers.$inferSelect;
export type NewFarmer = typeof farmers.$inferInsert;
