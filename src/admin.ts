import { drizzle } from "drizzle-orm/bun-sqlite";
import { roles } from "./schema";

export async function admin({ db: dbPath }: { db: string }) {
    const db = drizzle(dbPath);
    const role = await db
        .insert(roles)
        .values({ scope: ["*"] })
        .returning()
        .then(a => a[0]);
    process.stderr.write(`created new role '${role.id}' with scope '${role.scope.join("|")}'
token: `)
    console.log(role.token)
}
