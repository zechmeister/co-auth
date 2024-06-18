#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import template from "./commands/template";

yargs(hideBin(process.argv))
  .command(
    "template",
    "adds possible co-authors from repo to your commit message template",
    (yargs) =>
      yargs.option({
        n: { type: "number", description: "Amount of users" },
      }),
    (argv) => template(argv.n)
  )
  .help()
  .parse();
