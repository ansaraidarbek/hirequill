import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from "@/drizzle/schema";

let connectionString = env.DATABASE_URL;

export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema });
    