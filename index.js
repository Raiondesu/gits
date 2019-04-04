#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk').default;
var question = require('inquirer');

// Add commands to the program
// Add commands to the program
require('./commands').default(program);

// Initialize metadata
program
  .name('gits')
  .usage('<command> [options]')
  .version(chalk.greenBright(require('./package.json').version), '-v, --version');

// Accept input from user
program
  .parse(process.argv);

// Check the program.args obj
var NO_COMMAND_SPECIFIED = program.args.length === 0;

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
  // e.g. display usage
  program.help();
}
