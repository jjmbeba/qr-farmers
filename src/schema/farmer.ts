import { z } from "zod";

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
