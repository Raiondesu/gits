#!/usr/bin/env node

import * as program from 'commander';
import chalk from 'chalk';

// Add commands to the program
import addCommands from './commands';
import { spawn } from 'child_process';

addCommands(program);

// Initialize metadata
program.name('gits')
  .usage('<command> [options]')
  .version(`gits@${chalk.greenBright(require('../package.json').version)}`, '-v, --version');

// If unknown command - just redirect to git
program.on('command:*', function () {
  console.error('Invalid command %s.\nForwarding to git...\n', process.argv.slice(2).join(' '));

  spawn('git', process.argv.slice(2), { stdio: 'inherit', env: { FORCE_COLOR: 'true' } });
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
