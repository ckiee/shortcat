import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { serve } from "./serve";
import { admin } from "./admin";

const a = await yargs(hideBin(process.argv))
    .alias("h", "help")
    .alias("V", "version")
    .demandCommand()
    .command(
        "serve [listen]",
        "start the server",
        t =>
            t
                .demandOption("db-path")
                .positional("listen", {
                    describe: `what to bind on: a port or a JSON-encoded instance of bun.ServeOptions.
see https://elysiajs.com/patterns/configuration.html#serve`,
                    default: "1312",
                    type: "string"
                }),
        a => serve({
            listen: a.listen,
            db: a.dbPath as string
        })
    )
    .command(
        "admin",
        "manage the server",
        t => t.demandOption("db-path"),
        a => admin({ db: a["db-path"] as string })
    )
    .option("db-path", {
        alias: "d",
        type: "string",
        description: "path to sqlite db file"
    })
    .parse();
