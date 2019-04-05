#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var chalk_1 = require("chalk");
// Add commands to the program
var commands_1 = require("./commands");
var child_process_1 = require("child_process");
commands_1.default(program);
// Initialize metadata
program.name('gits')
    .usage('<command> [options]')
    .version("gits@" + chalk_1.default.greenBright(require('../package.json').version), '-v, --version');
// If unknown command - just redirect to git
program.on('command:*', function () {
    console.error('Invalid command %s.\nForwarding to git...\n', process.argv.slice(2).join(' '));
    child_process_1.spawn('git', process.argv.slice(2), { stdio: 'inherit', env: { FORCE_COLOR: 'true' } });
});
// Accept input from user
program.parse(process.argv);
// Check the program.args obj
var NO_COMMAND_SPECIFIED = process.argv.length <= 2;
// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
}
