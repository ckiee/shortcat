import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { Elysia, t } from "elysia";
import { eq, sql } from "drizzle-orm";
import { createLink, links, roles, schema } from "./schema";
import swagger from "@elysiajs/swagger";

const tlApp = new Elysia()

export async function serve({ port, db: dbPath }: { port: number; db: string }) {
    const db = drizzle(new Database(dbPath), { schema });

    const app = tlApp;

    const api = new Elysia({ prefix: "/_" })
        .post("/link", async ({ body }) => {
            const r = await db.insert(links).values(body).returning()
            return r[0];
        }, { body: createLink })

    app
        .use(swagger())
        .use(api)
        .get("/", () => "shortcat")
        .get("/*", async ({ params, redirect, error }) => {
            const short = params["*"];
            const link = await db.query.links.findFirst({
                where: eq(links.shortcode, short)
            });

            if (!link) return error(404);

            return redirect(link.destination, 302);
        })
        .listen(port);


    console.log(`listening on ${app.server?.hostname}:${app.server?.port}`);
}

