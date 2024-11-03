import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export type Scope = "admin";

export const roles = sqliteTable("role", {
    id: text()
        .notNull()
        .$defaultFn(() => nanoid())
        .primaryKey(),
    token: text().$defaultFn(() => "sct" + nanoid()),
    createdAt: integer({ mode: "timestamp_ms" })
        .notNull()
        .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
    scope: text({ mode: "json" })
        .$type<Scope[]>()
        .notNull()
        .$default(() => [])
});

export const Table = {
    roles
} as const;

export type Table = typeof Table;
