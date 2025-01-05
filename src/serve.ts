import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { Elysia, t } from "elysia";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { createGroup, createLink, groups, links, scopesSufficient, roles, schema, type Scope, getRole, buildConflictUpdateColumns } from "./schema";
import swagger from "@elysiajs/swagger";
import bearer from "@elysiajs/bearer";

export async function serve({ listen, db: dbPath }: { listen: string; db: string }) {
    const db = drizzle(new Database(dbPath), { schema });

    const api = new Elysia({ prefix: "/_shortcat", name: "api" })
        .use(bearer())
        .derive(async ({ bearer }) => {
            if (!bearer) return {};

            return {
                role: await db.query.roles.findFirst({ where: eq(roles.token, bearer) })
            }
        })
        .derive(({ role }) => ({
            hasScope: (scope: Scope) => scopesSufficient(role?.scope ?? [], scope)
        }))
        .macro(({ onBeforeHandle }) => ({
            needsScopes(requires: string[]) {
                if (!requires) return;
                onBeforeHandle(async ({ role, hasScope, error }) => {
                    if (!role)
                        return error(401);

                    if (!requires.every(required => hasScope!(<Scope>required)))
                        return error(401, `Role ${role?.id} has scope '${role.scope}', needed '${requires.join("|")}'`)
                })
            }
        }))
        .get("/ip", ({ server, request }) => server?.requestIP(request) ?? "awoo")

        .group("/roles", app =>
            app
                .get("me", ({ role }) => ({ role: role ?? null }),
                    {
                        detail: { description: "get yourself" },
                        response: t.Object({ role: t.Nullable(getRole) })
                    })
                .guard({ needsScopes: ["admin"] })
                .put("", async () => {
                    return {
                        role: await db.insert(roles).values({ scope: ["*"] }).returning().then(r => r[0])
                    }
                },
                    {
                        detail: {
                            description: "upsert a role",
                        },
                        response: t.Object({ role: getRole })
                    })
        )

        .group("/links", app =>
            app.guard({ needsScopes: ["user"] })
                .get("", async ({ role }) => {
                    return db.query.links.findMany()
                })

                .put("", async ({ body, role }) =>
                    await db.transaction(async tx => {
                        await tx.delete(links).where(inArray(links.group, body.declaresGroups));

                        return await tx.insert(links)
                            .values(body.links.map(o => ({ ...o, creator: role!.id })))
                            .onConflictDoUpdate({
                                target: links.shortcode,
                                set: { destination: sql.raw(`excluded.${links.destination.name}`) }
                            })
                            .returning()
                    }),
                    {
                        body: t.Object({
                            declaresGroups: t.Array(t.String()),
                            links: t.Array(createLink),
                        }),
                        detail: {
                            description: "upsert links, atomically replacing declarative groups if provided",
                        }
                    }))

        .group("/groups", app =>
            app.guard({ needsScopes: ["user"] })
                .get("", async ({ role, hasScope }) => ({
                    groups: await db.query.groups.findMany({
                        where: hasScope("admin") ? undefined : eq(groups.owner, role!.id)
                    })
                }))
                .get("/:nameOrId", async ({ role, params, error, hasScope }) => {
                    const group = await db.query.groups.findFirst({
                        where: and(
                            or(
                                eq(groups.name, params.nameOrId),
                                eq(groups.id, params.nameOrId),
                            ),
                            hasScope("admin") ? undefined : eq(groups.owner, role!.id)
                        )
                    });
                    return !group ? error(404) : { group };
                })
                .put("", async ({ body, role }) =>
                    await db.insert(groups)
                        .values({ ...body.group, owner: role!.id })
                        .onConflictDoUpdate({
                            target: groups.name,
                            set: buildConflictUpdateColumns(groups, ["protected", "name"])
                        })
                        .returning(),
                    {
                        body: t.Object({
                            group: createGroup
                        }),
                        detail: {
                            description: "create a new group, owned by the authenticated role"
                        }
                    }));


    const app = new Elysia()
        .use(swagger({
            documentation: {
                components: {
                    securitySchemes: {
                        roleToken: {
                            type: "http",
                            scheme: "bearer"
                        }
                    }
                }
            }
        }))
        .use(api)
        .get("/*", async ({ params, redirect, error }) => {
            const short = params["*"];
            const link = await db.query.links.findFirst({
                where: eq(links.shortcode, short)
            });

            if (!link) return error(404);

            return redirect(link.destination, 302);
        })
        .get("/", async ({ params, redirect, error }) => {
            const link = await db.query.links.findFirst({
                where: eq(links.shortcode, "")
            });

            if (!link) return error(404, "shortcat! (no toplevel link)");

            return redirect(link.destination, 302);
        })
        .listen(!+listen ? JSON.parse(listen) : parseInt(listen));


    console.log(`listening on ${app.server?.hostname}:${app.server?.port} (in ${app.server?.development ? "dev mode" : "production"})`);

    return app;
}

export type App = Awaited<ReturnType<typeof serve>>;
