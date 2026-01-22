import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Get database connection string from environment variables
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://localhost:5432/qr_farmers";

// Create postgres client
const client = postgres(connectionString, {
  max: 1, // Use a single connection for serverless environments
});

// Create Drizzle database instance
export const db = drizzle(client, { schema });

// Export schema for use in other files
export * from "./schema";
