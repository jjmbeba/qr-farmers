# QR Farmers - Farmer Management System

A farmer management system built with TanStack Start, React, TypeScript, shadcn/ui, TanStack Query, and Drizzle ORM for database operations.

## Features

- Farmer registration with QR code generation
- Data synchronization with TanStack Query
- Logistics scanner for QR code verification
- Print-friendly QR code labels

## Prerequisites

- Bun installed
- PostgreSQL database

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# PostgreSQL database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/qr_farmers
# Or use POSTGRES_URL as an alternative
POSTGRES_URL=postgresql://user:password@localhost:5432/qr_farmers
```

For production, set `DATABASE_URL` or `POSTGRES_URL` to your PostgreSQL database connection string.

## Database Setup

The application requires a PostgreSQL database with a `farmers` table. The table should have the following schema:

```sql
CREATE TABLE farmers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    assigned_crops JSONB NOT NULL,
    last_updated TEXT NOT NULL
);
```

## API Routes

The application includes server-side API routes for database operations:

- `GET /api/farmers` - Fetches all farmers
- `POST /api/farmers` - Creates a new farmer
- `PATCH /api/farmers/:id` - Updates a farmer
- `DELETE /api/farmers/:id` - Deletes a farmer

All API routes use Drizzle ORM for database operations and automatically handle data transformation between snake_case (database) and camelCase (API).

## Architecture

The application uses:
- **TanStack Query** for data fetching and caching
- **Drizzle ORM** for type-safe database operations
- **Query invalidation** to automatically refetch data after mutations

When a mutation (create, update, delete) succeeds, the `['farmers']` query is automatically invalidated, causing the farmer list to refetch and update.

## Development

```bash
bun install
bun run dev
```

## Building

```bash
bun run build
bun run preview
```
