import chalk from 'chalk';
import { Command, run } from '@oclif/command';

export = class Gits extends Command {
  public async run() {
    // const { args, flags } = this.parse(this.constructor as typeof Gits);
    this.log('here');
    this.config.version = chalk.greenBright(this.config.version);

    const minimumArgsLength = 2;

    // Check the program.args obj
    const NO_COMMAND_SPECIFIED = process.argv.length <= minimumArgsLength;

    if (NO_COMMAND_SPECIFIED) {
      this._help();
    } else {
      run(process.argv);
    }
  }
};
