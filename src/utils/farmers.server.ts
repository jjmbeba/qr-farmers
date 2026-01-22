import { eq } from "drizzle-orm";
import type { z } from "zod";
import { db, farmers } from "@/db";
import { appToDb, dbToApp, type farmerSchema } from "@/db/utils";

type Farmer = z.infer<typeof farmerSchema>;

// Get all farmers from database
export async function getAllFarmers(): Promise<Farmer[]> {
  const allFarmers = await db.select().from(farmers);
  // Transform snake_case to camelCase
  return allFarmers.map((farmer) => dbToApp(farmer));
}

// Create a new farmer in the database
export async function createFarmerInDb(farmer: Farmer): Promise<Farmer> {
  // Transform camelCase to snake_case for database
  const dbFarmer = appToDb(farmer);

  const [newFarmer] = await db.insert(farmers).values(dbFarmer).returning();

  if (!newFarmer) {
    throw new Error("Failed to create farmer");
  }

  // Transform back to camelCase
  return dbToApp(newFarmer);
}

// Update an existing farmer in the database
export async function updateFarmerInDb(
  id: string,
  updates: Partial<Farmer>
): Promise<Farmer> {
  // Build update object with only provided fields, transforming camelCase to snake_case
  const dbUpdates: Partial<{
    id: string;
    name: string;
    assigned_crops: string[];
    last_updated: string;
  }> = {};

  if (updates.name !== undefined) {
    dbUpdates.name = updates.name;
  }
  if (updates.assignedCrops !== undefined) {
    dbUpdates.assigned_crops = updates.assignedCrops;
  }
  if (updates.lastUpdated !== undefined) {
    dbUpdates.last_updated = updates.lastUpdated;
  }

  const [updatedFarmer] = await db
    .update(farmers)
    .set(dbUpdates)
    .where(eq(farmers.id, id))
    .returning();

  if (!updatedFarmer) {
    throw new Error("Farmer not found");
  }

  // Transform back to camelCase
  return dbToApp(updatedFarmer);
}

// Delete a farmer from the database
export async function deleteFarmerInDb(id: string): Promise<Farmer> {
  const [deletedFarmer] = await db
    .delete(farmers)
    .where(eq(farmers.id, id))
    .returning();

  if (!deletedFarmer) {
    throw new Error("Farmer not found");
  }

  // Transform back to camelCase
  return dbToApp(deletedFarmer);
}
