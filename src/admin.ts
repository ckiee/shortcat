import { drizzle } from "drizzle-orm/bun-sqlite";
import { roles } from "./schema";

export async function admin({ db: dbPath }: { db: string }) {
    const db = drizzle(dbPath);
    const role = await db
        .insert(roles)
        .values({ scope: ["admin"] })
        .returning()
        .then(a => a[0]);
    console.log({ role })
}
