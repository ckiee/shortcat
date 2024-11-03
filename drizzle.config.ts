/// Drizzle-kit config

import type { Config } from "drizzle-kit";
const env = process.env;

export default {
    schema: "./src/schema.ts",
    out: "./migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: env.DATABASE_URL ?? ""
    }
} satisfies Config;
