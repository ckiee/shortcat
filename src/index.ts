import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { serve } from "./serve";
import { admin } from "./admin";

const a = await yargs(hideBin(process.argv))
    .alias("h", "help")
    .alias("V", "version")
    .demandCommand()
    .command(
        "serve [port]",
        "start the server",
        t =>
            t
                .demandOption("db-path")
                .positional("port", { describe: "port to bind on", default: 1312 }),
        a => serve({ port: a.port, db: a["db-path"] })
    )
    .command(
        "admin",
        "manage the server",
        t => t.demandOption("db-path"),
        a => admin({ db: a["db-path"] })
    )
    .option("db-path", {
        alias: "d",
        type: "string",
        description: "path to sqlite db file"
    })
    .parse();
