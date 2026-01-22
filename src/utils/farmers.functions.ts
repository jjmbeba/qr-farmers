import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { farmerSchema } from "@/db/utils";
import {
  createFarmerInDb,
  deleteFarmerInDb,
  getAllFarmers,
  updateFarmerInDb,
} from "./farmers.server";

// Get all farmers - GET request
export const getFarmers = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      return await getAllFarmers();
    } catch (error) {
      console.error("Error fetching farmers:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch farmers"
      );
    }
  }
);

// Create a new farmer - POST request
export const createFarmer = createServerFn({ method: "POST" })
  .inputValidator(farmerSchema)
  .handler(async ({ data }) => {
    try {
      return await createFarmerInDb(data);
    } catch (error) {
      console.error("Error creating farmer:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create farmer"
      );
    }
  });

// Update an existing farmer - POST request
export const updateFarmer = createServerFn({ method: "POST" })
  .inputValidator(farmerSchema)
  .handler(async ({ data }) => {
    try {
      const { id, ...updates } = data;
      return await updateFarmerInDb(id, updates);
    } catch (error) {
      console.error("Error updating farmer:", error);
      if (error instanceof Error && error.message === "Farmer not found") {
        throw notFound();
      }
      throw new Error(
        error instanceof Error ? error.message : "Failed to update farmer"
      );
    }
  });

// Delete a farmer - POST request
export const deleteFarmer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1, { message: "ID is required" }),
    })
  )
  .handler(async ({ data }) => {
    try {
      return await deleteFarmerInDb(data.id);
    } catch (error) {
      console.error("Error deleting farmer:", error);
      if (error instanceof Error && error.message === "Farmer not found") {
        throw notFound();
      }
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete farmer"
      );
    }
  });
