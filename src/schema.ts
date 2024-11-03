import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";
import { t } from "elysia"

export type Scope = "admin";

const id = text()
    .notNull()
    .$defaultFn(() => nanoid())
    .primaryKey();

const createdAt = integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`);

export const roles = sqliteTable("role", {
    id, createdAt,
    token: text().$defaultFn(() => "sct" + nanoid()),
    scope: text({ mode: "json" })
        .$type<Scope[]>()
        .notNull()
        .$default(() => [])
});

export const links = sqliteTable("link", {
    id, createdAt,
    shortcode: text().notNull(),
    destination: text().notNull(),
    group: text().references(() => groups.id)
});

const _createLink = createInsertSchema(links);
export const createLink = t.Omit(_createLink, ["id", "createdAt"]);

export const groups = sqliteTable("group", {
    id, createdAt,
    name: text().notNull().unique().$default(() => ""),
});

export const schema = {
    roles,
    groups,
    links
} as const;

export type Schema = typeof schema;
