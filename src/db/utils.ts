import { z } from "zod";
import type { Farmer } from "./schema";

// Database schema (snake_case - matches Postgres columns)
const farmerDBSchema = z.object({
  id: z.string(),
  name: z.string(),
  assigned_crops: z.array(z.string()),
  last_updated: z.string(),
});

// App schema (camelCase - for React components)
export const farmerSchema = z.object({
  id: z.string().min(1, {
    message: "ID is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  assignedCrops: z.array(z.string()).min(1, {
    message: "At least one crop is required",
  }),
  lastUpdated: z.string(),
});

// Transform camelCase (app) to snake_case (database)
export const appToDb = (
  farmer: z.infer<typeof farmerSchema>
): z.infer<typeof farmerDBSchema> => ({
  id: farmer.id,
  name: farmer.name,
  assigned_crops: farmer.assignedCrops,
  last_updated: farmer.lastUpdated,
});

// Transform snake_case (database) to camelCase (app)
export const dbToApp = (farmer: Farmer): z.infer<typeof farmerSchema> => ({
  id: farmer.id,
  name: farmer.name,
  assignedCrops: farmer.assigned_crops as string[],
  lastUpdated: farmer.last_updated,
});
