import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { Elysia } from "elysia";
import { eq, sql } from "drizzle-orm";
import { roles } from "./schema";

export async function serve({ port, db: dbPath }: { port: number; db: string }) {
    const db = drizzle(new Database(dbPath));
    const app = new Elysia()
        .get("/", () => "shortcat")
        .get("/*", async ({ params, redirect }) => {
            const short = params["*"];
            return await db.select().from(roles).where(eq(roles.id, short))
            // return redirect(`https://pupc.at/${short}`, 302);
        })
        .listen(port);

    console.log(`listening on ${app.server?.hostname}:${app.server?.port}`);
}
