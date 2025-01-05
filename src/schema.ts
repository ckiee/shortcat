import { getTableColumns, SQL, sql } from "drizzle-orm";
import { integer, SQLiteTable, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";
import { t } from "elysia"
import type { PgTable } from "drizzle-orm/pg-core";

// admin.*: role management
// user.*: link, group management
// *: an admin
// user.*: a user
type BaseScope = "user" | "admin";
export type Scope = "*" | BaseScope | `${BaseScope}.*`;

export const scopesSufficient = (has: Scope[], want: Scope): boolean =>
    has.includes("*")
    || has.includes(want)
    || (want.split(".").length > 1 &&
        scopesSufficient(has, <Scope>(want.split(".").slice(0, -1).join(".") + ".*")));


/// see: https://orm.drizzle.team/docs/guides/upsert#postgresql-and-sqlite
export const buildConflictUpdateColumns = <
    T extends PgTable | SQLiteTable,
    Q extends keyof T['_']['columns']
>(
    table: T,
    columns: Q[],
) => {
    const cls = getTableColumns(table);

    return columns.reduce((acc, column) => {
        const colName = cls[column].name;
        acc[column] = sql.raw(`excluded.${colName}`);

        return acc;
    }, {} as Record<Q, SQL>);
};


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

const _getRole = createSelectSchema(roles);
export const getRole = t.Omit(_getRole, []);

export const links = sqliteTable("link", {
    createdAt,
    shortcode: text().notNull().primaryKey(),
    destination: text().notNull(),
    group: text().references(() => groups.id),
    creator: text().notNull().references(() => roles.id)
});

const _createLink = createInsertSchema(links, {
    shortcode: t.String()
});
export const createLink = t.Omit(_createLink, ["id", "createdAt", "creator"]);

export const groups = sqliteTable("group", {
    id, createdAt,
    owner: text().notNull().references(() => roles.id),
    name: text().notNull().unique(),
    protected: text({ enum: ["readonly"] })
});

const _createGroup = createInsertSchema(groups, {
    name: t.String({ minLength: 1 })
});
export const createGroup = t.Omit(_createGroup, ["id", "createdAt", "owner"]);

export const schema = {
    roles,
    groups,
    links
} as const;

export type Schema = typeof schema;
