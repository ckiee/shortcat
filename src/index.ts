import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const args = yargs(hideBin(process.argv))
    .alias("h", "help")
    .alias("V", "version")
    .demandCommand()
    .command(
        "serve [port]",
        "start the server",
        _ => {},
        // _.positional("port", {
        //     describe: "port to bind on",
        //     default: 5000
        // }),
        argv => {
            if (argv.verbose) console.info(`start server on :${argv.port}`);
        }
    )
    .option("db-path", {
        alias: "d",
        type: "string",
        description: "path to sqlite db file"
    })
    .parse();

console.log(args);
